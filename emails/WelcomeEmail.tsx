import { Html, Head, Preview, Body, Container, Section, Text, Button, Img, Font } from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clovercapitalhills.com';

export default function WelcomeEmail({ fullName }: { fullName: string }) {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Syne"
                    fallbackFontFamily="sans-serif"
                    webFont={{ url: 'https://fonts.gstatic.com/s/syne/v22/8vIQ7w4Mhni_c-o.woff2', format: 'woff2' }}
                />
            </Head>
            <Preview>Welcome to Clover Hills</Preview>
            <Body style={{ backgroundColor: '#000000', color: '#ffffff', fontFamily: 'Syne, sans-serif' }}>
                <Container style={{ margin: '0 auto', padding: '40px 20px', maxWidth: '600px' }}>
                    <Section style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
                        <Img src={`${baseUrl}/logoImages/logo.png`} alt="Clover Hills" height="40" style={{ display: 'block' }} />
                    </Section>
                    <Text style={{ fontSize: '16px', lineHeight: '24px' }}>
                        Hi {fullName},
                    </Text>
                    <Text style={{ fontSize: '16px', lineHeight: '24px' }}>
                        Your account application at Clover Hills has been successfully received.
                        Our team is currently reviewing your profile. You will receive an email as soon as your account is approved and ready to use.
                    </Text>
                    <Section style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Button href="https://clovercapitalhills.com/login" style={{ backgroundColor: '#ffffff', color: '#000000', padding: '12px 24px', textDecoration: 'none', letterSpacing: '0.1em', fontWeight: 'bold' }}>
                            ACCESS PORTAL
                        </Button>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

