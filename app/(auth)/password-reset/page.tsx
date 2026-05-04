import PasswordResetForm from "@/components/auth/PasswordResetForm";
import React from "react";

export default function PasswordReset() {
    return (
        <div className="max-w-sm">
            <p className="text-center text-primary/70 text-[15px] mb-14">
                Введите адрес email, к которму привязан аккаунт и мы отправим
                вам ссылку для сброса пароля
            </p>
            <PasswordResetForm />
        </div>
    );
}
