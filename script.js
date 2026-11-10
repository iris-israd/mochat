import { createClient } from '@supabase/supabasejs'

const SUPABASE_URL = ""
const SUPABASE_ANON = ""
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

const chatbox = document.getElementById(box)
const input = document.getElementById(msgin)
const send = document.getElementById(send)

async function loadmsg() {
  const { data, error } = await supabase.rpc('get_recent_messages')
  if (error) {
    console.log("ERROR:")
    console.error(error)
    return
  }
  chatbox.innerHTML = data.map(m => '<p><b>${m.username}:</b> ${m.content}</p>').join('')
}

send.addEventListener('click', async () => {
  const content = input.value
  if (!content) return

  const { error } = await supabase.rpc('post_message', { message_text: content })
  if (error) {
    console.log("ERROR:")
    console.error(error)
  } else {
    input.value = ''
  }
})

supabase
  .channel('public:messages')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'MESSAGES' }, payload => {
    const newMsg = payload.new
    chatbox.innerHTML += '<p><b>${newMsg.username}:</b> ${newMsg.content}</p>'
  })
  .subscribe()

loadmsg()
