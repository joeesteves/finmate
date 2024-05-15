export const getServerSideProps = async () => {
  // Fetch data from external API
  const res = await fetch('http://localhost:3000/api/admin/accounts')
  const repo = await res.json()
  // Pass data to the page via props
  return { props: { repo } }
}

type Account = {
  id: string
  name: string
}

export default function Accounts({ repo }: { repo: Account[] }) {
  return (
    <div>
      <h1>Accounts</h1>
      <p>Here you can manage your accounts.</p>
      <ul>
        {repo.map((account) => (
          <li key={account.id}>{account.name}</li>
        ))}
      </ul>
    </div>
  )
}
