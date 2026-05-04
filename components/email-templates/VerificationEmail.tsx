import React from "react";

interface Props {
    email: string;
    code: number;
}

export default function VerificationEmail({ code, email }: Props) {
    const verificationUrl = `${process.env.APP_BASE_URL}/api/auth/verification?email=${email}&code=${code}`;
    const codeString = String(code);

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <div style={styles.content}>
                    <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        width="100%"
                    >
                        <tr>
                            <td align="center" style={{ padding: "0" }}>
                                <img
                                    width="50"
                                    height="50"
                                    src={`${process.env.APP_BASE_URL}/img/logo.svg`}
                                    alt="Logo"
                                    style={{
                                        display: "block",
                                        margin: "0 auto",
                                    }}
                                />
                            </td>
                        </tr>
                    </table>

                    <h1 style={styles.title}>Подтверждение email</h1>

                    <p style={styles.text}>
                        Благодарим за регистрацию! Чтобы завершить создание
                        аккаунта, используйте код подтверждения ниже или
                        перейдите по ссылке.
                    </p>

                    <b
                        style={{
                            textAlign: "center",
                            fontSize: "40px",
                            marginBottom: "16px",
                            display: "block",
                        }}
                    >
                        {code}
                    </b>

                    <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        width="100%"
                    >
                        <tr>
                            <td
                                align="center"
                                style={{ padding: "0 0 32px 0" }}
                            >
                                <a href={verificationUrl} style={styles.button}>
                                    Подтвердить email
                                </a>
                            </td>
                        </tr>
                    </table>

                    <p style={styles.linkText}>
                        Или скопируйте и вставьте эту ссылку в браузер:
                    </p>

                    <a href={verificationUrl} style={styles.link}>
                        {verificationUrl}
                    </a>
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    body: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        lineHeight: "1.6",
        color: "#333333",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f5f5f5",
    },
    container: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    content: {
        padding: "40px",
    },
    title: {
        marginTop: "0",
        fontSize: "28px",
        fontWeight: "700",
        color: "#2d3748",
        marginBottom: "24px",
        textAlign: "center",
    },
    text: {
        fontSize: "16px",
        color: "#4a5568",
        marginBottom: "32px",
        textAlign: "center",
        lineHeight: "1.8",
    },
    codeChar: {
        display: "inline-block",
        width: "48px",
        height: "56px",
        lineHeight: "56px",
        fontSize: "28px",
        fontWeight: "700",
        color: "#2d3748",
        textAlign: "center",
        backgroundColor: "#f7fafc",
        border: "2px solid #e2e8f0",
        borderRadius: "8px",
        fontFamily: "monospace",
    },
    button: {
        display: "inline-block",
        padding: "16px 32px",
        background: "linear-gradient(135deg, #3d7bff 0%, #9523fb 100%)",
        color: "#ffffff",
        textDecoration: "none",
        borderRadius: "8px",
        fontSize: "18px",
        fontWeight: "600",
        textAlign: "center",
    },
    linkText: {
        fontSize: "14px",
        color: "#a0aec0",
        marginBottom: "8px",
        textAlign: "center",
    },
    link: {
        display: "block",
        fontSize: "14px",
        color: "#667eea",
        marginBottom: "32px",
        padding: "12px",
        backgroundColor: "#f7fafc",
        borderRadius: "6px",
        wordBreak: "break-all",
        textAlign: "center",
        fontFamily: "monospace",
    },
    warning: {
        backgroundColor: "#fffbeb",
        border: "1px solid #fef3c7",
        borderRadius: "8px",
        padding: "10px 20px",
        marginTop: "20px",
    },
    warningText: {
        fontSize: "14px",
        color: "#92400e",
        marginBottom: "8px",
        lineHeight: "1.6",
    },
};
