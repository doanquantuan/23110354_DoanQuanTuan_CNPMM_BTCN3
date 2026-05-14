import Input from '../ui/Input'

/**
 * FormField — convenience wrapper combining label + input + validation
 * Designed to work with useForm hook pattern
 */
const FormField = ({ name, errors = {}, register, ...inputProps }) => {
  return (
    <Input
      id={name}
      error={errors[name]?.message}
      {...inputProps}
    />
  )
}

export default FormField
