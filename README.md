# payments-api

API de pagos **ficticia** que usamos como proyecto de práctica en 30X · AI for Developers.

```bash
npm install
npm start      # http://localhost:3000
npm test
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | /health | Estado del servicio |
| POST | /payments | Crea un cargo `{ amount, method }` |
