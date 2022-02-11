import { useCallback, memo } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import useForm from '@eduzz/houston-forms/useForm';
import Button from '@eduzz/houston-ui/Button';
import CurrencyField from '@eduzz/houston-ui/Forms/Currency';
import DateField from '@eduzz/houston-ui/Forms/DatePicker';
import Form from '@eduzz/houston-ui/Forms/Form';
import SelectField, { ISelectFieldOption } from '@eduzz/houston-ui/Forms/Select';
import TextField from '@eduzz/houston-ui/Forms/Text';
import Grid from '@eduzz/houston-ui/Grid';
import styled, { IStyledProp } from '@eduzz/houston-ui/styles/styled';
import Toast from '@eduzz/houston-ui/Toast';

import { ICampaign } from '@/interfaces/models/campaign';
import campaignService from '@/services/campaign';

interface IProps extends IStyledProp {
  opened: boolean;
  data?: ICampaign;
  onComplete: (data: ICampaign) => void;
  onCancel: () => void;
}

const sources: ISelectFieldOption[] = [
  { label: 'Facebook', value: 1 },
  { label: 'Instagram', value: 2 },
  { label: 'Whatsapp', value: 3 },
  { label: 'Telegram', value: 4 }
];

const CampaignForm: React.FC<IProps> = ({ opened, data, onComplete, onCancel, className }) => {
  const form = useForm<ICampaign>({
    validationSchema: yup =>
      yup.object().shape({
        name: yup.string().required().min(3).max(250),
        link: yup.string().required().url().max(1000),
        source: yup.string().when('name', {
          is: '' || undefined,
          then: yup.string().required('Campo obrigatório'),
          otherwise: yup.string()
        }),
        investment: yup.number().required().min(0),
        revenues: yup.number().min(0),
        beginDate: yup.date().required(),
        endDate: yup.date().min(yup.ref('beginDate'), 'Deve ser maior que a data de início').required()
      }),
    async onSubmit(model) {
      const result = await campaignService.save(model);
      Toast.success(`A campanha ${result.name} foi salva com sucesso.`);
      onComplete(result);
      console.log(result);
    }
  });

  const handleEnter = useCallback(() => {
    form.setValues(data ?? {}, false);
    console.log(data);
    console.log(form);
  }, [form, data]);

  const handleExited = useCallback(() => {
    form.reset();
  }, [form]);

  return (
    <Dialog open={opened} disableEscapeKeyDown TransitionProps={{ onEnter: handleEnter, onExited: handleExited }}>
      <Form context={form} className={className}>
        {form.values.id ? (
          <>
            <DialogTitle>Editar Campanha</DialogTitle>
            <DialogContent className='content'>
              <TextField label='Nome da campanha' name='name' disabled />
              <TextField label='Link' name='link' placeholder='https://minha-campanha.exemplo.com' disabled />
              <SelectField
                label='Fonte da campanha'
                name='source'
                emptyOption='Selecione'
                options={sources}
                value={form.values.source_id}
                disabled
              />

              <Grid.Row>
                <Grid.Column xs={12} sm={6}>
                  <CurrencyField label='Valor investido' name='investment' placeholder='R$' />
                </Grid.Column>
                <Grid.Column xs={12} sm={6}>
                  <CurrencyField label='Valor faturado' name='revenues' placeholder='R$' />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column xs={12} sm={6}>
                  <DateField label='Data de início' name='beginDate' disabled />
                </Grid.Column>
                <Grid.Column xs={12} sm={6}>
                  <DateField label='Data de término' name='endDate' />
                </Grid.Column>
              </Grid.Row>
            </DialogContent>
            <DialogActions>
              <Button variant='text' onClick={onCancel}>
                Cancelar
              </Button>
              <Button type='submit' disabled={form.isSubmitting} loading={form.isSubmitting}>
                Salvar
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Cadastre uma nova campanha</DialogTitle>
            <DialogContent className='content'>
              <TextField label='Nome da campanha' name='name' />
              <TextField label='Link' name='link' placeholder='https://minha-campanha.exemplo.com' />
              <SelectField label='Fonte da campanha' name='source' emptyOption='Selecione' options={sources} />

              <Grid.Row>
                <Grid.Column xs={12} sm={6}>
                  <CurrencyField label='Valor investido' name='investment' placeholder='R$' />
                </Grid.Column>
                <Grid.Column xs={12} sm={6}>
                  <CurrencyField label='Valor faturado (Opcional)' name='revenues' placeholder='R$' />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column xs={12} sm={6}>
                  <DateField label='Data de início' name='beginDate' />
                </Grid.Column>
                <Grid.Column xs={12} sm={6}>
                  <DateField label='Data de término (prevista)' name='endDate' />
                </Grid.Column>
              </Grid.Row>
            </DialogContent>
            <DialogActions>
              <Button variant='text' onClick={onCancel}>
                Cancelar
              </Button>
              <Button type='submit' disabled={form.isSubmitting} loading={form.isSubmitting}>
                Salvar
              </Button>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

export default styled(memo(CampaignForm))`
  & .content {
    width: 600;
    max-width: calc(95vw - 50px);
  }
`;
