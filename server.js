const express = require("express");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(bodyParser.json());

const API_KEY = process.env.API_KEY || "123456";

sgMail.setApiKey(process.env.SENDGRID_KEY);

app.post("/send", async (req, res) => {
    const { key, to, subject, message, html } = req.body;

    if (key !== API_KEY) {
        return res.status(403).json({ error: "Acesso negado" });
    }

    const msg = {
        to: to,
        from: "zonalesteroleplay@outlook.com",
        subject: subject,
        text: message,
        html: html,
    };

    try {
        await sgMail.send(msg);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        const erroDetalhado = err.response && err.response.body ? JSON.stringify(err.response.body) : err.message;
        res.json({ success: false, error: erroDetalhado });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});