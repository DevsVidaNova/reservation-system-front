import { exec } from 'child_process';

export async function POST(req) {
    try {
        const deployScript = () => {
            return new Promise((resolve, reject) => {
                exec('/root/scripts/deploy.sh', (error, stdout, stderr) => {
                    if (error) {
                        reject(`Erro ao executar deploy: ${error.message}`);
                    } else if (stderr) {
                        reject(`Erro no stderr: ${stderr}`);
                    } else {
                        resolve(stdout);
                    }
                });
            });
        };
        const output = await deployScript();
        console.log(`Saída do deploy: ${output}`);

        return new Response('Webhook processado e deploy realizado', { status: 200 });
    } catch (err) {
        console.error('Erro ao processar o webhook:', err);
        return new Response('Erro ao processar o webhook', { status: 500 });
    }
}
