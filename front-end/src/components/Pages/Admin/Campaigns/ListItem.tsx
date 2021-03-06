import { memo, useCallback, useState, useMemo } from 'react';

import DeleteIcon from 'mdi-react/DeleteIcon';
import EditIcon from 'mdi-react/EditIcon';

import FacebookOutline from '@eduzz/houston-icons/FacebookOutline';
import InstagramOutline from '@eduzz/houston-icons/InstagramOutline';
import PaperAirplaneOutline from '@eduzz/houston-icons/PaperAirplaneOutline';
import Telegram from '@eduzz/houston-icons/Telegram';
import WhatsApp from '@eduzz/houston-icons/WhatsApp';
import Table from '@eduzz/houston-ui/Table';
import Toast from '@eduzz/houston-ui/Toast';
import Typography from '@eduzz/houston-ui/Typography';

import Alert from '@/components/Globals/Alert';
import { dateFormat } from '@/formatters/date';
import { formatMoney } from '@/formatters/money';
import { ICampaign } from '@/interfaces/models/campaign';
import campaignService from '@/services/campaign';

const iconsMap = {
  1: FacebookOutline,
  2: InstagramOutline,
  3: WhatsApp,
  4: Telegram
};

interface IProps {
  data: ICampaign;
  index: number;
  onEdit: (data: ICampaign) => void;
  onDeleteComplete?: () => void;
}

const ListItem = memo((props: IProps) => {
  const { data, onEdit, onDeleteComplete, index } = props;

  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const Icon = useMemo(() => {
    return iconsMap[data.source_id] ?? PaperAirplaneOutline;
  }, [data.source_id]);

  const handleEdit = useCallback(() => {
    onEdit(data);
  }, [onEdit, data]);

  const handleDelete = useCallback(async () => {
    const confirm = await Alert.confirm({
      title: 'Excluir campanha',
      message: (
        <Typography>
          Deseja realmente excluir a campanha <strong>{data.name}</strong>?
        </Typography>
      ),
      okMessage: 'Excluir'
    });
    if (!confirm) return;

    setLoading(true);

    try {
      await campaignService.delete(data.id);
      setDeleted(true);
      setLoading(false);
      onDeleteComplete && onDeleteComplete();
    } catch (err) {
      Toast.error(`N??o foi poss??vel excluir a campanha ${data.name}.`);
      setDeleted(false);
    }
  }, [onDeleteComplete, data.name, data.id]);

  if (deleted) {
    return null;
  }

  return (
    <Table.Row data={data} index={index}>
      <Table.Cell mobileSize={3}>
        <Icon size={30} />
      </Table.Cell>
      <Table.Cell mobileSize={7}>{data.name}</Table.Cell>
      <Table.Cell mobileSize={6} align='right' mobileAlign='left'>
        {formatMoney(data.investment)}
      </Table.Cell>
      <Table.Cell mobileSize={6} align='right' mobileAlign='left'>
        {formatMoney(data.revenues)}
      </Table.Cell>
      <Table.Cell mobileSize={6}>{dateFormat(data.beginDate)}</Table.Cell>
      <Table.Cell mobileSize={6}>{dateFormat(data.endDate)}</Table.Cell>
      <Table.Cell mobileSize={12} align='right' mobileAlign='left'>
        {(((data.revenues - data.investment) / data.investment) * 100).toFixed(2)}%
      </Table.Cell>
      <Table.ActionLoading show={loading} />
      <Table.Action icon={<EditIcon />} onClick={handleEdit}>
        Editar
      </Table.Action>
      <Table.Action icon={<DeleteIcon />} onClick={handleDelete}>
        Excluir
      </Table.Action>
    </Table.Row>
  );
});

export default ListItem;
