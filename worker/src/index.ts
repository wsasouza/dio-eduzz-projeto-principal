import { Channel, connect, Connection } from "amqplib";
import { RABBIT_DSN, SENDGRID_TOKEN } from "./settings";
import sendgrid from "@sendgrid/mail";

(async () => {
  sendgrid.setApiKey(SENDGRID_TOKEN);

  let connection: Connection = await connect(RABBIT_DSN);
  let channel: Channel = await connection.createChannel();

  channel.assertQueue("user.password.reset");
  channel.prefetch(1);
  channel.consume(
    "user.password.reset",
    async (msg) => {
      if (!msg) return;
      const json = msg.content.toString() || "";
      const { name, email, link } = JSON.parse(json);
      const body = {
        to: `${name} <${email}>`,
        from: "wsasouza@hotmail.com",
        subject: "Recuperacao de senha",
        html: `<strong>Uma troca de senha para sua conta foi solicitada.</strong>
               <br />
               <p>Se foi você, então clique no link abaixo para escolher uma nova senha:</p>               
               <p><a href='${link}'>Trocar a minha senha</a></p>
               <p>Agora se não foi você, então descarte esse email!</p>
               <br />               
               <p>
                 Atenciosamente,<br />
                 <strong>Equipe Eduzz</strong>
               </p>
        `,
      };
      try {
        await sendgrid.send(body);
        channel.ack(msg);
      } catch (err: any) {
        console.log(err.response.body);
        channel.nack(msg);
      }
    },
    {
      noAck: false,
    }
  );
})();
