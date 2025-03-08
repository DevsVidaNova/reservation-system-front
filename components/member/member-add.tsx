"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Button,
    Input,
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
    Message,
    Form,
    FormControl,
    FormField,
    FormItem,
    Checkbox,
    FormMessage,
    FormLabel,
} from "@/components/ui/";
import { addMember } from "../../app/__api/members";
import { Check } from "lucide-react";


const formSchema = z.object({
    full_name: z.string().min(2, "O nome completo deve ter pelo menos 2 caracteres."),
    birth_date: z.string().nonempty("A data de nascimento é obrigatória."),
    gender: z.enum(["Masculino", "Feminino", "Outro"]),
    cpf: z.string().nonempty("O CPF é obrigatório."),
    rg: z.string().nonempty("O RG é obrigatório."),
    phone: z.string().nonempty("O número de telefone é obrigatório."),
    email: z.string().email("Insira um e-mail válido."),
    street: z.string().nonempty("O nome da rua é obrigatório."),
    number: z.string().nonempty("O número da residência é obrigatório."),
    neighborhood: z.string().nonempty("O bairro é obrigatório."),
    city: z.string().nonempty("A cidade é obrigatória."),
    state: z.string().nonempty("O estado é obrigatório."),
    cep: z.string().nonempty("O CEP é obrigatório."),
    mother_name: z.string().nonempty("O nome da mãe é obrigatório."),
    father_name: z.string().nonempty("O nome do pai é obrigatório."),
    marital_status: z.enum(["Solteiro", "Casado", "Viúvo", "Divorciado"]),
    has_children: z.boolean(),
    children_count: z.number().min(0, "A quantidade de filhos não pode ser negativa."),
    available_days: z.array(z.string()).nonempty("Os dias disponíveis são obrigatórios."),
    available_hours: z.array(z.string()).nonempty("As horas disponíveis são obrigatórias."),
    interests: z.array(z.string()).nonempty("Os interesses são obrigatórios."),
    skills: z.array(z.string()).nonempty("As habilidades são obrigatórias."),
    health_restrictions: z.string().optional(),
    previous_volunteering: z.boolean(),
    previous_volunteering_place: z.string().optional(),
});


export function MemberAddForm({ refetch }: { refetch: () => void }) {
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            birth_date: "",
            gender: "Masculino",
            cpf: "",
            rg: "",
            phone: "",
            email: "",

            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            cep: "",

            mother_name: "",
            father_name: "",
            marital_status: "Solteiro",
            has_children: false,
            children_count: 0,



            available_days: [],
            available_hours: [],
            interests: [],
            skills: [],

            health_restrictions: "",
            previous_volunteering: false,
            previous_volunteering_place: "",
        },
    });


    const handleCEP = () => {
        const cep = form.getValues("cep");
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then((response) => response.json())
                .then((data) => {
                    form.setValue("street", data.logradouro);
                    form.setValue("neighborhood", data.bairro);
                    form.setValue("city", data.localidade);
                    form.setValue("state", data.uf);
                }).catch((error) => {
                    console.error(error);
                });
        }
    }

    useEffect(() => {
        handleCEP();
    }, [form.getValues("cep")]);


    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('bora')
        setError("");
        setSuccess("");
        try {
            const response = await addMember(values);
            if (response) {
                setSuccess("Usuário criado com sucesso!");
                form.reset();
                refetch();
            }
        } catch (error: any) {
            setError(error.message);
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="default">Criar membro</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="container mx-auto px-4">
                    <DrawerHeader>
                        <DrawerTitle>Criar membro</DrawerTitle>
                        <DrawerDescription>Preencha os dados do membro para continuar.</DrawerDescription>
                    </DrawerHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            <Steps step={step} setstep={setStep} />

                            {step === 1 && (
                                <>
                                    <FormField
                                        control={form.control} name="full_name" render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input label="Nome Completo" placeholder="Nome completo" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="birth_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        label="Data de nascimento"
                                                        placeholder="DD/MM/AAAA"
                                                        maxLength={10}
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                                .replace(/\D/g, "")
                                                                .replace(/(\d{2})(\d)/, "$1/$2")
                                                                .replace(/(\d{2})(\d)/, "$1/$2")
                                                                .slice(0, 10);
                                                            field.onChange(value);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        label="Telefone"
                                                        placeholder="(47) 99123-4567"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                                .replace(/\D/g, "")
                                                                .replace(/^(\d{2})(\d)/g, "($1) $2")
                                                                .replace(/(\d{5})(\d)/, "$1-$2")
                                                                .slice(0, 15)
                                                            field.onChange(value)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        label="E-mail"
                                                        placeholder="E-mail" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="rg"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="12.345.678-9"
                                                        {...field}
                                                        label="RG"
                                                        maxLength={12}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                                .replace(/\D/g, "")
                                                                .replace(/(\d{2})(\d)/, "$1.$2")
                                                                .replace(/(\d{3})(\d)/, "$1.$2")
                                                                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                                                            field.onChange(value);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cpf"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="123.456.789-01"
                                                        {...field}
                                                        maxLength={14}
                                                        label='CPF'
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                                .replace(/\D/g, "")
                                                                .replace(/(\d{3})(\d)/, "$1.$2")
                                                                .replace(/(\d{3})(\d)/, "$1.$2")
                                                                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                                                            field.onChange(value);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>)}
                                    />

                                    <Button onClick={() => setStep(2)} className="w-full">Próximo</Button>
                                </>

                            )}
                            {step === 2 && (
                                <>
                                    <FormField control={form.control} name="cep" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    label="CEP"
                                                    placeholder="XXXXXXXX"
                                                    maxLength={8}
                                                    {...field}
                                                />

                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />


                                    <FormField
                                        control={form.control} name="state" render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input label="Estado" placeholder="Estado" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control} name="city" render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input label="Cidade" placeholder="Cidade" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control} name="neighborhood" render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input label="Bairro" placeholder="Bairro" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control} name="street" render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input label="Endereço" placeholder="Endereço" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control} name="number" render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input label="Numero" placeholder="Numero" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex gap-2">
                                        <Button onClick={() => setStep(1)} className="w-full bg-black">Voltar</Button>
                                        <Button onClick={() => setStep(3)} className="w-full">Próximo</Button>
                                    </div>

                                </>
                            )}
                            {step === 3 && (
                                <>
                                    <FormField control={form.control} name="mother_name" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    label="Nome da Mãe"
                                                    placeholder="Nome da Mãe"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="father_name" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    label="Nome do Pai"
                                                    placeholder="Nome do Pai"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="marital_status" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    label="Estado Cívil"
                                                    placeholder="Solteiro, Casado, Viúvo ou Divorciado"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="has_children" render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <label className="opacity-70">Possui filhos?</label>
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="children_count" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    label="Se sim, quantos?"
                                                    placeholder="2"
                                                    {...field}
                                                    maxLength={2}
                                                    type="number"
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10)
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <div className="flex gap-2">

                                        <Message success={success} error={error} />
                                        <Button onClick={() => setStep(2)} className="w-full bg-black">Voltar</Button>
                                        <Button className="w-full" type="submit">Criar membro
                                        </Button>
                                    </div>
                                </>
                            )}

                        </form>
                    </Form>

                    <DrawerClose className="w-full my-4">
                        <Button variant="secondary" className="w-full">Fechar</Button>
                    </DrawerClose>
                </div>
            </DrawerContent>
        </Drawer>
    );
}


const Steps = ({ step, setstep }: { step: number, setstep: any }) => {
    return (
        <div className="flex flex-row gap-4 w-full items-center justify-between">
            <div onClick={() => setstep(1)} className="text-center cursor-pointer items-center flex justify-center flex-col w-30 border rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-full text-center justify-center items-center flex text-xl ${step == 1 ? 'bg-blue-200 text-blue-600' : step > 1 ? 'bg-green-200' : 'bg-gray-200'}`}>{step > 1 ? <Check className="text-green-700" /> : '1'}</div>
                <span className="opacity-70">Sobre</span>
            </div>
            <div className="w-full h-[1px] bg-border mb-5 -mx-4" />
            <div onClick={() => setstep(2)} className="text-center cursor-pointer items-center flex justify-center flex-col w-30 border rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-full text-center justify-center items-center flex text-xl ${step == 2 ? 'bg-blue-200 text-blue-600' : step > 2 ? 'bg-green-200' : 'bg-gray-200'}`}>{step > 2 ? <Check className="text-green-700" /> : '2'}</div>
                <span className="opacity-70">Endereço</span>
            </div>
            <div className="w-full h-[1px] bg-border mb-5 -mx-4" />
            <div onClick={() => setstep(3)} className="text-center cursor-pointer items-center flex justify-center flex-col w-30 border rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-full text-center justify-center items-center flex text-xl ${step == 3 ? 'bg-blue-200 text-blue-600' : step > 3 ? 'bg-green-200' : 'bg-gray-200'}`}>{step > 3 ? <Check className="text-green-700" /> : '3'}</div>
                <span className="opacity-70">Familia</span>
            </div>
        </div>
    )
};