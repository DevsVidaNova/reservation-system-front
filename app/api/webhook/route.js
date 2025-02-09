import { exec } from 'child_process';

export async function POST(req) {
    try {
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
