import { useState } from 'react'
import './Form.css'

export default function Form() {
  const [form, setForm] = useState({ name: '', surname: '', company: '', street: '', house: '', postal: '', city: '', email: '', date: '', message: '', materials: '', contactName: '', contactSurname: '', contactPhone: '', contactEmail: '', delivery: '', deliveryAddressOption: '', shipStreet: '', shipHouse: '', shipPostal: '', shipCity: '', agree: false })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    const errs = {}
  if (!form.name.trim()) errs.name = 'Imię jest wymagane'
  if (!form.surname || !form.surname.trim()) errs.surname = 'Nazwisko jest wymagane'
  // optional: if a date is provided, ensure it's a valid date string
  if (form.date && isNaN(Date.parse(form.date))) errs.date = 'Nieprawidłowa data'
    if (!form.email.trim()) errs.email = 'Email jest wymagany'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Nieprawidłowy email'
    if (!form.message.trim()) errs.message = 'Wiadomość jest wymagana'
    if (!form.agree) errs.agree = 'Musisz zaakceptować regulamin'
    // postal code validation (optional) - Polish format 00-000
    if (form.postal && !/^\d{2}-\d{3}$/.test(form.postal)) errs.postal = 'Kod pocztowy powinien mieć format 00-000'
    return errs
  }

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length === 0) {
      try {
        const res = await fetch(`${API_BASE}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, surname: form.surname, company: form.company, street: form.street, house: form.house, postal: form.postal, city: form.city, email: form.email, date: form.date, message: form.message }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data && data.error ? data.error : 'Server error')
    setSubmitted({ status: 'sent' })
    setForm({ name: '', surname: '', company: '', street: '', house: '', postal: '', city: '', email: '', date: '', message: '', materials: '', contactName: '', contactSurname: '', contactPhone: '', contactEmail: '', delivery: '', deliveryAddressOption: '', shipStreet: '', shipHouse: '', shipPostal: '', shipCity: '', agree: false })
      } catch (err) {
        setSubmitted({ status: 'error', message: err.message })
      }
    }
  }

  return (
    <div className="form-wrap">
      <form onSubmit={handleSubmit} noValidate>
        <h2>Wniosek o udostępnienie materiałów powiatowego zasobu geodezyjnego i kartograficznego</h2>

        <h3>1. Imię i nazwisko / Nazwa  oraz adres wnioskodawcy</h3>
        <div className="row three-columns">
          <div className="field">
            <label htmlFor="name">Imię</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="field">
            <label htmlFor="surname">Nazwisko</label>
            <input id="surname" name="surname" value={form.surname} onChange={handleChange} />
            {errors.surname && <div className="error">{errors.surname}</div>}
          </div>
          <div className="field">
            <label htmlFor="company">Nazwa firmy*</label>
            <input id="company" name="company" value={form.company} onChange={handleChange} />
            {errors.company && <div className="error">{errors.company}</div>}
          </div>
        </div>

        <h4>Adres wnioskodawcy</h4>
        <div className="field">
          <label htmlFor="street">Ulica</label>
          <input id="street" name="street" value={form.street} onChange={handleChange} />
        </div>

        <div className="row">
          <div className="field" style={{ flex: '0 0 200px' }}>
            <label htmlFor="house">Nr domu / lokalu</label>
            <input id="house" name="house" value={form.house} onChange={handleChange} />
          </div>

          <div className="field" style={{ flex: '0 0 140px' }}>
            <label htmlFor="postal">Kod pocztowy</label>
            <input id="postal" name="postal" value={form.postal} onChange={handleChange} placeholder="00-000" />
            {errors.postal && <div className="error">{errors.postal}</div>}
          </div>

          <div className="field">
            <label htmlFor="city">Miejscowość</label>
            <input id="city" name="city" value={form.city} onChange={handleChange} />
          </div>
        </div>
        
        <h4>2. Data</h4>

        <div className="field">
          <label htmlFor="date">Data</label>
          <input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
          {errors.date && <div className="error">{errors.date}</div>}
        </div>

        <h5> 3. Adresat wniosku – nazwa i adres organu lub jednostki organizacyjnej, która w imieniu organu prowadzi państwowy zasób geodezyjny i kartograficzny</h5>
        <div className ="receiver">
          <p>Starostwo Powiatowe w Nowym Dworze Gdańskim</p>
          <p>ul. Sikorskiego 23</p>
          <p>82-100 Nowy Dwór Gdański</p>
        </div>

        <h6>4. Dane kontaktowe wnioskodawcy (nr telefonu/adres email)</h6>
        <div className="field">
          <label htmlFor="phone">Nr telefonu</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <h6>5. Oznaczenie wniosku nadane przez wnioskodawcę*</h6>

        <div className="field">
          <label htmlFor="message">Wiadomość</label>
          <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} />
          {errors.message && <div className="error">{errors.message}</div>}
        </div>

        <h6>6. Określenie materiałów będących przedmiotem wniosku</h6>

        <div className='field checkbox'>
          <label>
            <input name="materials" type="radio" value="mapa_zasadnicza" checked={form.materials === 'mapa_zasadnicza'} onChange={handleChange} />{' '}
            Mapa zasadnicza lub mapa ewidencji gruntów i budynków
          </label>
          <label>
            <input name="materials" type="radio" value="baza_egib" checked={form.materials === 'baza_egib'} onChange={handleChange} />{' '}
            Baza danych ewidencji gruntów i budynków
          </label>
          <label>
            <input name="materials" type="radio" value="gesut" checked={form.materials === 'gesut'} onChange={handleChange} />{' '}
            Baza danych geodezyjnej ewidencji sieci uzbrojenia terenu (GESUT) 
          </label>
          <label>
            <input name="materials" type="radio" value="bdot500" checked={form.materials === 'bdot500'} onChange={handleChange} />{' '}
            Baza danych obiektów topograficznych o szczegółowości zapewniającej tworzenie standardowych opracowań kartograficznych w skalach 1:500 - 1:5000 (BDOT500)
          </label>
          <label>
            <input name="materials" type="radio" value="rejestr_cen" checked={form.materials === 'rejestr_cen'} onChange={handleChange} />{' '}
            Rejestr cen nieruchomości
          </label>
          <label>
            <input name="materials" type="radio" value="raporty_egib" checked={form.materials === 'raporty_egib'} onChange={handleChange} />{' '}
            Raporty tworzone na podstawie bazy danych EGiB
          </label>
          <label>
            <input name="materials" type="radio" value="inne" checked={form.materials === 'inne'} onChange={handleChange} />{' '}
            Inne materiały 
          </label>
        </div>

        <h6>7. Cel pobrania materiałów</h6>
          <p>7a. Udostępnienie odpłatne </p>
          <div className='field checkbox'>
          <label>
            <input name="materials" type="radio" value="opcja1" checked={form.materials === 'opcja1'} onChange={handleChange} />{' '}
            dla potrzeb własnych niezwiązanych z działalnością gospodarczą, bez prawa publikacji w sieci Internet
          </label>
          <label>
            <input name="materials" type="radio" value="opcja2" checked={form.materials === 'opcja2'} onChange={handleChange} />{' '}
            w celu wykonania wyceny nieruchomości – rzeczoznawcom majątkowym (dotyczy tylko rejestru cen nieruchomości)
          </label>
          <label>
            <input name="materials" type="radio" value="opcja3" checked={form.materials === 'opcja3'} onChange={handleChange} />{' '}
            dla dowolnych potrzeb
          </label>
          <label>
            <input name="materials" type="radio" value="opcja4" checked={form.materials === 'opcja4'} onChange={handleChange} />{' '}
            w celu kolejnego udostępnienia zbiorów danych dotyczących sieci uzbrojenia terenu podmiotowi władającemu siecią uzbrojenia terenu
          </label>
        </div>
        <p>7b. Udostępnienie nieodpłatne w postaci elektronicznej</p>
        <div className='field checkbox'>
          <label>
            <input name="materials" type="radio" value="opcja1" checked={form.materials === 'opcja1'} onChange={handleChange} />{' '}
            na cele edukacyjne jednostkom organizacyjnym wchodzącym w skład systemu oświaty11, uczelniom<sup>12</sup>, podmiotom pożytku publicznego<sup>13</sup>
          </label>
          <label>
            <input name="materials" type="radio" value="opcja2" checked={form.materials === 'opcja2'} onChange={handleChange} />{' '}
            w celu prowadzenia badań naukowych/prac rozwojowych<sup>14</sup>
          </label>
          <label>
            <input name="materials" type="radio" value="opcja3" checked={form.materials === 'opcja3'} onChange={handleChange} />{' '}
            w celu realizacji ustawowych zadań w zakresie ochrony bezpieczeństwa wewnętrznego państwa i jego porządku konstytucyjnego – służbom specjalnym<sup>15</sup>
          </label>
          <label>
            <input name="materials" type="radio" value="opcja4" checked={form.materials === 'opcja4'} onChange={handleChange} />{' '}
            w celu realizacji zadań w zakresie obronności państwa – Ministrowi Obrony Narodowej
          </label>
          <label>
            <input name="materials" type="radio" value="opcja5" checked={form.materials === 'opcja5'} onChange={handleChange} />{' '}
            w celu pierwszego udostępnienia zbiorów danych dotyczących sieci uzbrojenia terenu podmiotowi władającemu siecią uzbrojenia terenu<sup>10</sup>
          </label>
        </div>
        <div className='contact'>
          <h6><sup>8</sup> Osoba wyznaczona do kontaktu ze strony wnioskodawcy</h6>
          <div className="row three-columns">
            <div className="field">
              <label htmlFor="contactName">Imię</label>
              <input id="contactName" name="contactName" value={form.contactName} onChange={handleChange} />
              {errors.contactName && <div className="error">{errors.contactName}</div>}
            </div>

            <div className="field">
              <label htmlFor="contactSurname">Nazwisko</label>
              <input id="contactSurname" name="contactSurname" value={form.contactSurname} onChange={handleChange} />
              {errors.contactSurname && <div className="error">{errors.contactSurname}</div>}
            </div>

            <div className="field">
              <label htmlFor="contactPhone">Nr telefonu</label>
              <input id="contactPhone" name="contactPhone" type="tel" value={form.contactPhone} onChange={handleChange} />
              {errors.contactPhone && <div className="error">{errors.contactPhone}</div>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="contactEmail">Email</label>
            <input id="contactEmail" name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} />
            {errors.contactEmail && <div className="error">{errors.contactEmail}</div>}
          </div>
        </div>
        <div className='sharing'>
          <h>9. Sposób udostępnienia materiałów**</h>
          <div className="field checkbox">
            <label>
              <input name="delivery" type="radio" value="odbior_osobisty" checked={form.delivery === 'odbior_osobisty'} onChange={handleChange} />{' '}
              odbiór osobisty
            </label>
            <label>
              <input name="delivery" type="radio" value="wysylka" checked={form.delivery === 'wysylka'} onChange={handleChange} />{' '}
              wysyłka pod wskazany adres
            </label>
          </div>

          {form.delivery === 'wysylka' && (
            <div className="field checkbox">
              <label>
                <input name="deliveryAddressOption" type="radio" value="jak_w_naglowku" checked={form.deliveryAddressOption === 'jak_w_naglowku'} onChange={handleChange} />{' '}
                jak w nagłówku
              </label>
              <label>
                <input name="deliveryAddressOption" type="radio" value="inny" checked={form.deliveryAddressOption === 'inny'} onChange={handleChange} />{' '}
                inny
              </label>

              {form.deliveryAddressOption === 'inny' && (
                <div className="shipping-address">
                  <div className="row">
                    <div className="field">
                      <label htmlFor="shipStreet">Ulica</label>
                      <input id="shipStreet" name="shipStreet" value={form.shipStreet} onChange={handleChange} />
                    </div>
                    <div className="field" style={{ flex: '0 0 120px' }}>
                      <label htmlFor="shipHouse">Nr domu</label>
                      <input id="shipHouse" name="shipHouse" value={form.shipHouse} onChange={handleChange} />
                    </div>
                    <div className="field" style={{ flex: '0 0 120px' }}>
                      <label htmlFor="shipPostal">Kod pocztowy</label>
                      <input id="shipPostal" name="shipPostal" value={form.shipPostal} onChange={handleChange} placeholder="00-000" />
                    </div>
                    <div className="field">
                      <label htmlFor="shipCity">Miejscowość</label>
                      <input id="shipCity" name="shipCity" value={form.shipCity} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <label>
              <input name="delivery" type="radio" value="share" checked={form.delivery === 'share'} onChange={handleChange} />{' '}
              usługa sieciowa udostępnienia
          </label>
          <label>
              <input name="delivery" type="radio" value="ftp" checked={form.delivery === 'ftp'} onChange={handleChange} />{' '}
              udostępnienie na serwerze FTP organu<sup>16</sup>
          </label>
          <label>
              <input name="delivery" type="radio" value="email" checked={form.delivery === 'email'} onChange={handleChange} />{' '}
              wysyłka na wskazany adres email
          </label>
          <label>
              <input name="delivery" type="radio" value="pendrive" checked={form.delivery === 'pendrive'} onChange={handleChange} />{' '}
              udostępnienie materiału na nośniku dostarczonym przez wnioskodawcę
          </label>
        </div>
        <div className="field checkbox">
          <label>
            <input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} />{' '}
            Akceptuję regulamin
          </label>
          {errors.agree && <div className="error">{errors.agree}</div>}
        </div>

        <div className="actions">
          <button type="submit">Wyślij</button>
        </div>
      </form>

      {submitted && (
        <div className="submitted">
          {submitted.status === 'sent' ? (
            <>
              <h3>Wiadomość wysłana</h3>
              <p>Dziękujemy — wiadomość została wysłana na wskazany adres.</p>
            </>
          ) : (
            <>
              <h3>Błąd wysyłki</h3>
              <p>Wystąpił problem podczas wysyłania: {submitted.message}</p>
            </>
          )}
        </div>
      )}
      <div className="info">
        <h>Przypisy: </h>
        <p>1. Informacje o aktualnie dostępnych materiałach powiatowego zasobu geodezyjnego i kartograficznego udostępnia organ prowadzący ten zasób</p>
        <p>2. Szczegóły wniosku o udostępnienie mapy zasadniczej lub mapy ewidencji gruntów i budynków zawarte są w formularzu P1</p>
        <p>3. Szczegóły wniosku o udostępnienie zbioru danych bazy danych ewidencji gruntów i budynków (EGiB) zawarte są w formularzu P2</p>
        <p>4. Szczegóły wniosku o udostępnienie zbioru danych bazy danych geodezyjnej ewidencji sieci uzbrojenia terenu (GESUT) zawarte są w formularzu P3.</p>
        <p>5. Szczegóły wniosku o udostępnienie zbioru danych bazy danych obiektów topograficznych o szczegółowości zapewniającej tworzenie standardowych opracowań kartograficznych w skalach 1:500 - 1:5000 (BDOT500) zawarte są w formularzu P4</p>
        <p>6. Szczegóły wniosku o udostępnienie rejestru cen nieruchomości zawarte są w formularzu P5</p>
        <p>7. Szczegóły wniosku o udostępnienie raportów tworzonych na podstawie bazy danych EGiB zawarte są w formularzu P6.</p>
        <p>8. Szczegóły wniosku o udostępnienie innych materiałów zawarte są w formularzu P7.</p>
        <p>9. Dopuszczalne jest wskazanie tylko jednego celu</p>
        <p>10. Zgodnie z art. 40a ust. 2 pkt 5 ustawy z dnia 17 maja 1989 r. – Prawo geodezyjne i kartograficzne (Dz. U. z 2021 r. poz. 1990, z późn. zm.).</p>
        <p>11. Dotyczy jednostek organizacyjnych wchodzących w skład systemu oświaty, o którym mowa w ustawie z dnia 14 grudnia 2016 r. – Prawo oświatowe (Dz. U. z 2023 r. poz. 900)</p>
        <p>12. Dotyczy uczelni w rozumieniu ustawy z dnia 20 lipca 2018 r. – Prawo o szkolnictwie wyższym i nauce (Dz. U. z 2023 r. poz. 742, z późn. zm.).</p>
        <p>13. Dotyczy podmiotów, o których mowa w art. 3 ust. 2 i 3 ustawy z dnia 24 kwietnia 2003 r. o działalności pożytku publicznego i o wolontariacie (Dz. U. z 2023 r. poz. 571)</p>
        <p>14. Dotyczy: </p>
         <p1>1) podmiotów, o których mowa w art. 7 ust. 1 pkt 1, 2 i 4 – 7 ustawy z dnia 20 lipca 2018 r. – Prawo o szkolnictwie wyższym i nauce, oraz innych podmiotów posiadających siedzibę na terytorium Rzeczypospolitej Polskiej, będących organizacjami prowadzącymi badania i upowszechniającymi wiedzę w rozumieniu art. 2 pkt 83 rozporządzenia Komisji (UE) nr 651/2014 z dnia 17 czerwca 2014 r.
         uznającego niektóre rodzaje pomocy za zgodne z rynkiem wewnętrznym w zastosowaniu art. 107 i 108 Traktatu (Dz. Urz. UE L 187 z 26.06.2014, str. 1, z późn. zm.);</p1>
         <p2> 2) podmiotów, o których mowa w art. 3 ust. 2 i 3 ustawy z dnia 24 kwietnia 2003 r. o działalności pożytku publicznego i o wolontariacie.</p2>
        <p>15. Dotyczy służb specjalnych w rozumieniu art. 11 ustawy z dnia 24 maja 2002 r. o Agencji Bezpieczeństwa Wewnętrznego oraz Agencji Wywiadu (Dz. U. z 2020 r. poz. 27).</p>
        <p>16. Lub jednostki organizacyjnej, która w imieniu organu prowadzi państwowy zasób geodezyjny i kartograficzny</p>
        <p>17. Dotyczy tylko przypadków, gdy wybrano odbiór osobisty lub wysyłkę pod wskazany adres.</p>
        <p>18. Podpis własnoręczny; w przypadku składania wniosku w postaci elektronicznej: kwalifikowany podpis elektroniczny, podpis osobisty albo podpis zaufany; w przypadku składania wniosku za pomocą
systemu teleinformatycznego, o którym mowa w przepisach wydanych na podstawie art. 40 ust. 8 ustawy z dnia 17 maja 1989 r. – Prawo geodezyjne i kartograficzne, identyfikator umożliwiający
weryfikację wnioskodawcy w tym systemie.</p>
      </div>
      <div className="explaination">
        <h>Wyjaśnienia: </h>
        <p>* - pola nieobowiązkowe</p>
      </div>
    </div>
  )
}
