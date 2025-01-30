"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent,  } from "@/components/ui/card"
import { loginUser } from '@/app/api/user'
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [session, setsession] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.')
      setIsLoading(false)
      return
    }
    try {
      const res = await loginUser(email, password, session)
      if (res?.user.isAdmin) {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      setError('E-mail ou senha incorretos.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleWhatsApp = () => {
  
  }

  return (
    <div className="flex flex-col items-center justify-center bg-background w-full h-screen">
      <Card className="w-[350px] self-center border-none shadow-none">
        <CardHeader>
          <Link href="/" className='w-full items-center self-center mx-auto flex flex-col justify-center'>
            <img src="/imgs/logo_black.png" className="w-[220px] h-[70px] bg-gray self-center items-center" />
          </Link>
          <CardTitle className="text-2xl hidden">Entrar</CardTitle>
          <CardDescription className='hidden'>Digite seu email e senha para acessar sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
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
                className="text-sm font-medium text-primary opacity-70 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Manter conectado
              </label>
            </div>
          </div>
        </CardContent>
        <div className='px-6 pb-6'>
          {error && <div className='bg-red-200  mt-2 py-2 px-4 w-max rounded-md'><p className="text-red-500">{error}</p></div>}
          <Button onClick={handleSubmit} disabled={isLoading} className='w-full' >
            {isLoading ? 'Enviando' : 'Entrar'}
          </Button>
          <Button onClick={handleWhatsApp} variant='secondary' className='w-full mt-4' >
            Solicitar acesso
          </Button>
        </div>
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

