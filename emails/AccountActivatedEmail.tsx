import { Html, Head, Preview, Body, Container, Section, Text, Button } from '@react-email/components';
import * as React from 'react';

export default function AccountActivatedEmail({ fullName }: { fullName: string }) {
    return (
        <Html>
            <Head />
            <Preview>Your Clover Hills account has been activated.</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={headerText}>CLOVER HILLS</Text>
                    </Section>
                    <Section style={section}>
                        <Text style={text}>Hello {fullName},</Text>
                        <Text style={text}>We are pleased to inform you that your account has been successfully verified and activated by our compliance team.</Text>
                        <Text style={text}>You now have full access to our algorithmic trading tiers and can begin deploying capital into your preferred strategies.</Text>
                        <Button
                            style={button}
                            href="https://clovercapitalhills.com/dashboard"
                        >
                            Access Your Dashboard
                        </Button>
                        <Text style={footer}>
                            If you have any questions, please reach out via the Live Chat on our platform.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: '#050505',
    color: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '40px 20px',
    maxWidth: '580px',
};

const header = {
    borderBottom: '1px solid #1a1a1a',
    paddingBottom: '20px',
    marginBottom: '40px',
};

const headerText = {
    fontSize: '12px',
    fontWeight: 'bold' as const,
    letterSpacing: '0.4em',
    textAlign: 'center' as const,
    margin: '0',
    color: '#ffffff',
};

const section = {
    padding: '0 20px',
};

const text = {
    fontSize: '14px',
    lineHeight: '26px',
    marginBottom: '20px',
};

const button = {
    backgroundColor: '#d4af37',
    borderRadius: '0px',
    color: '#000',
    fontSize: '11px',
    fontWeight: 'bold' as const,
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '16px 20px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    marginTop: '20px',
    marginBottom: '20px',
};

const footer = {
    fontSize: '12px',
    color: '#666',
    marginTop: '40px',
    borderTop: '1px solid #1a1a1a',
    paddingTop: '20px',
};
