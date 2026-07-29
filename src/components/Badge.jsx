export const Badge = ({ email, priority }) => {
  return (
    <div>
      <p>{email}</p>
      <span>{priority}</span>
    </div>
  )
}
