require('dotenv').config()
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// simple health
app.get('/', (req, res) => res.send('Form server running'))

app.post('/send', async (req, res) => {
  const { name, surname, company, street, house, postal, city, email, date, message } = req.body || {}
  if (!name || !surname || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' })
  }

  // read SMTP settings from env
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const toEmail = process.env.TO_EMAIL

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !toEmail) {
    return res.status(500).json({ ok: false, error: 'Server not configured for email (missing env vars)' })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const info = await transporter.sendMail({
      from: `${name} ${surname} <${email}>`,
      to: toEmail,
      subject: `Nowa wiadomość z formularza od ${name} ${surname}`,
      text: `Imię: ${name}\nNazwisko: ${surname}\nNazwa firmy: ${company || ''}\nUlica: ${street || ''}\nNr domu/lokalu: ${house || ''}\nKod pocztowy: ${postal || ''}\nMiejscowość: ${city || ''}\nEmail: ${email}\nData: ${date || ''}\n\nWiadomość:\n${message}`,
      html: `<p><strong>Imię:</strong> ${name}</p><p><strong>Nazwisko:</strong> ${surname}</p><p><strong>Nazwa firmy:</strong> ${company || ''}</p><p><strong>Ulica:</strong> ${street || ''}</p><p><strong>Nr domu/lokalu:</strong> ${house || ''}</p><p><strong>Kod pocztowy:</strong> ${postal || ''}</p><p><strong>Miejscowość:</strong> ${city || ''}</p><p><strong>Email:</strong> ${email}</p><p><strong>Data:</strong> ${date || ''}</p><p><strong>Wiadomość:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    })

    return res.json({ ok: true, messageId: info.messageId })
  } catch (err) {
    console.error('Error sending email', err)
    return res.status(500).json({ ok: false, error: 'Failed to send email' })
  }
})

app.listen(PORT, () => console.log(`Form server listening on http://localhost:${PORT}`))
