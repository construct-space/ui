import type Avatar from '../src/components/Avatar.vue'
import type Card from '../src/components/Card.vue'
import type ConfirmationModal from '../src/components/ConfirmationModal.vue'
import type Select from '../src/components/Select.vue'
import type Table from '../src/components/Table.vue'

type PropsOf<T> = T extends new () => { $props: infer P } ? P : never

type AvatarProps = PropsOf<typeof Avatar>
type CardProps = PropsOf<typeof Card>
type ConfirmationModalProps = PropsOf<typeof ConfirmationModal>
type SelectProps = PropsOf<typeof Select>
type TableProps = PropsOf<typeof Table>

const _avatarProps: AvatarProps = { size: 'xs' }

const _selectSingleProps: SelectProps = {
  modelValue: 'open',
  options: ['open', 'closed'],
}

const _selectMultipleProps: SelectProps = {
  multiple: true,
  modelValue: ['open', 'closed'],
  options: ['open', 'closed'],
}

const dynamicAlign = 'right'
const _tableProps: TableProps = {
  columns: [{ key: 'total', label: 'Total', align: dynamicAlign }],
  rows: [{ invoice: '1', line: 'a', total: 10 }],
  rowKey: (row: Record<string, unknown>) => `${row.invoice}:${row.line}`,
}

const _cardProps: CardProps = {}
const _confirmationProps: ConfirmationModalProps = {
  modelValue: true,
  message: 'Delete record?',
}

void _avatarProps
void _selectSingleProps
void _selectMultipleProps
void _tableProps
void _cardProps
void _confirmationProps
