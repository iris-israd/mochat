import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://tetjkynfqavnqrzzbbul.supabase.co"
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldGpreW5mcWF2bnFyenpiYnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyNzE5NDYsImV4cCI6MjEwOTg0Nzk0Nn0.T1H7AD0MQ0658cH9KaamBO3_oZjY6fiUqE_kY3AevUY"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

const chatbox = document.getElementById('box')
const input = document.getElementById('msgin')
const send = document.getElementById('send')
const user = document.getElementById('username')
const sendun = document.getElementById('sendun')

let currentUsername = "Anonymous"

async function loadmsg() {
  const { data, error } = await supabase.rpc('get_recent_messages')
  if (error) {
    console.log("ERROR:")
    console.error(error)
    return
  }
  chatbox.innerHTML = data.map(m => `<p><b>${m.username || 'Anonymous'}:</b> ${m.content}</p>`).join('')
}

send.addEventListener('click', async () => {
  const content = input.value.trim()
  if (!content) return

  const { error } = await supabase.rpc('post_message', {
    message_text: content,
    username_text: currentUsername
  })

  if (error) {
    console.log("ERROR:")
    console.error(error)
  } else {
    input.value = ''
    await loadmsg()
  }
})

sendun.addEventListener('click', () => {
  const usernamev = user.value.trim()
  if (usernamev) {
    currentUsername = usernamev
    user.value = ''
  } else {
    console.log("No.")
  }
})

supabase
  .channel('public:messages')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
    const newMsg = payload.new
    if (newMsg.content) {
      chatbox.innerHTML += `<p><b>${newMsg.username || 'Anonymous'}:</b> ${newMsg.content}</p>`
    }
  })
  .subscribe()

loadmsg()
