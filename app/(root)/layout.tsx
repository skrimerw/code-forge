import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

interface Props {
    children: React.ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <>
            <Header />
            <main>
                <Container>{children}</Container>
            </main>
            <Footer />
        </>
    );
}
