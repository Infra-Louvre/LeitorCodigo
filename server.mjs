import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000; // Você pode escolher outra porta se preferir

// Middleware para permitir CORS (se necessário para desenvolvimento)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Rota para proxy
app.get('/consultapreco', async (req, res) => {
    try {
        const codigo = req.query.codigo;
        console.log(`Recebido código: ${codigo}`); // Log do código recebido
        const response = await fetch(`http://177.69.22.97:8082/rest/cBPrecos?codigo=${codigo}`);
        console.log(`Resposta do servidor remoto: ${response.status}`); // Log do status da resposta

        const responseBody = await response.text(); // Obtém o corpo da resposta como texto
        console.log('Corpo da resposta do servidor remoto:', responseBody);

        if (!response.ok) {
            console.error('Erro do servidor remoto:', responseBody); // Log do erro do servidor remoto
            if (response.status === 404) {
                return res.status(404).json({ error: 'Código não encontrado no banco de dados.' });
            }
            throw new Error(`Erro ao consultar o preço: ${response.status} ${responseBody}`);
        }

        const data = JSON.parse(responseBody); // Converte o texto para JSON

        // Verificação para referência
        if (!data.referencia) {
            data.referencia = 'Não possui referência';
        }

        console.log('Dados recebidos do servidor remoto:', data); // Log dos dados recebidos
        res.json(data);
    } catch (error) {
        console.error("Erro na requisição:", error);
        res.status(500).json({ error: `Erro ao consultar o preço: ${error.message}` });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
