import { exec } from 'child_process';

export async function POST(req) {
    try {
        // Se desejar, você pode validar o segredo aqui, para garantir que a solicitação é do GitHub
        // Exemplo de verificação (usando um segredo)
        // const signature = req.headers.get('x-hub-signature');
        // const payload = await req.text();
        // const expectedSignature = `sha1=${crypto.createHmac('sha1', 'YOUR_SECRET').update(payload).digest('hex')}`;
        // if (signature !== expectedSignature) {
        //     return new Response('Invalid signature', { status: 403 });
        // }
        exec('/root/scripts/deploy.sh', (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar deploy: ${error.message}`);
                return new Response('Erro ao atualizar o servidor', { status: 500 });
            }
            console.log(`Saída do deploy: ${stdout}`);
        });

        return new Response('Webhook processado e deploy realizado', { status: 200 });
    } catch (err) {
        console.error('Erro ao processar o webhook:', err);
        return new Response('Erro ao processar o webhook', { status: 500 });
    }
}
