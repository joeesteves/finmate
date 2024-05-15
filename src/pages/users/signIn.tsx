const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const target = e.target as typeof e.target & {
    name: { value: string }
    password: { value: string }
    email: { value: string }
  }
  const name = target.name.value
  const password = target.password.value
  const email = target.email.value

  fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ name, password, email }),
  })
    .then((res) => res.json())
    .then(console.log)
}

const UserSignIn = () => {
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Username" />
      <input type="text" name="password" placeholder="Password" />
      <input type="text" name="email" placeholder="Email" />
      <button type="submit">Register</button>
    </form>
  )
}

export default UserSignIn
