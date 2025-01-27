"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import {  registerUser } from '@/app/api/user'
import { Checkbox } from "@/components/ui/checkbox"

export default function Register() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setphone] = useState('');
  const [name, setname] = useState('');

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [session, setsession] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    if (!email || !password || !phone || !name) {
      setError('Por favor, preencha todos os campos.')
      setIsLoading(false)
      return
    }
    try {
      await registerUser({ email: email, password: password, phone: phone, name: name, username: name }, session)
      router.push('/dashboard')
    } catch (error: any) {
      console.log(error)
      setError('E-mail ou senha incorretos.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-[#F7F7F7] w-full">
      <Card className="w-[350px] self-center">
        <CardHeader>
          <img src="/imgs/logo_black.png" className="w-[220px] h-[70px] bg-gray self-center" />
          <CardTitle className="text-2xl ">Criar conta</CardTitle>
          <CardDescription >Preencha os dados abaixo para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="name"
                  placeholder="Ex.: Jesus de Nazaré"
                  label="Nome completo"
                  type="text"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  required
                />
              </div>
              <Input
                placeholder="(99) 99999-9999"
                value={phone}
                label='Celular (com DDD)'
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .replace(/^(\d{2})(\d)/g, "($1) $2")
                    .replace(/(\d{5})(\d)/, "$1-$2")
                    .slice(0, 15)
                  setphone(value)
                }}
              />
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="email"
                  placeholder="Ex.: email@exemplo.com"
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="password"
                  label='Senha'
                  placeholder="Ex.: ********"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
          <div className="align-start flex space-x-2 mt-4">
            <Checkbox onClick={() => setsession(!session)} id="terms1" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Manter conectado
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex-col'>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full bg-[#000] text-[16px] font-semibold py-6 rounded-full">
            {isLoading ? 'Enviando' : 'Criar conta'}
          </Button>
          {error && <div className='bg-red-200  mt-2 py-2 px-4 w-max rounded-md'><p className="text-red-500">{error}</p></div>}
        </CardFooter>
      </Card>
      <p className="mt-8 text-gray-500 w-[300px] text-center">
        Ao continuar, você concorda com nossos
        <a href="/privacy" className="text-gray-700 underline"> Politica de Privacidade </a>
        e
        <a href="/terms" className="text-gray-700 underline"> Termos de Uso</a>.
      </p>
    </div>
  )
}

