import { Html, Head, Preview, Body, Container, Section, Text, Img, Font } from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clovercapitalhills.com';

export default function AdminActionEmail({ actionType, details }: { actionType: string, details: string }) {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Syne"
                    fallbackFontFamily="sans-serif"
                    webFont={{ url: 'https://fonts.gstatic.com/s/syne/v22/8vIQ7w4Mhni_c-o.woff2', format: 'woff2' }}
                />
            </Head>
            <Preview>Account Update - Clover Hills</Preview>
            <Body style={{ backgroundColor: '#000000', color: '#ffffff', fontFamily: 'Syne, sans-serif' }}>
                <Container style={{ margin: '0 auto', padding: '40px 20px', maxWidth: '600px' }}>
                    <Section style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
                        <Img src={`${baseUrl}/logoImages/logo.png`} alt="Clover Hills" height="40" style={{ display: 'block', marginBottom: '10px' }} />
                        <Text style={{ fontSize: '12px', color: '#888', letterSpacing: '0.1em' }}>ACCOUNT UPDATE</Text>
                    </Section>
                    <Text style={{ fontSize: '16px', lineHeight: '24px' }}>
                        An update has been made to your Clover Hills account.
                    </Text>
                    <Text style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 'bold' }}>
                        Action: {actionType}
                    </Text>
                    <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#90EE90' }}>
                        {details}
                    </Text>
                    <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#888', marginTop: '40px' }}>
                        If you have any questions, please contact your account manager.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}
