const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const target = e.target as typeof e.target & {
    username: { value: string }
    password: { value: string }
    email: { value: string }
  }
  const username = target.username.value
  const password = target.password.value
  const email = target.email.value

  fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ username, password, email }),
  })
    .then((res) => res.json())
    .then(console.log)
}

const UserSignIn = () => {
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" />
      <input type="text" name="password" placeholder="Password" />
      <input type="text" name="email" placeholder="Email" />
      <button type="submit">Register</button>
    </form>
  )
}

export default UserSignIn
