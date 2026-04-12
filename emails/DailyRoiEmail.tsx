import { Html, Head, Preview, Body, Container, Section, Text, Img, Font } from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clovercapitalhills.com';

export default function DailyRoiEmail({ amount, newBalance }: { amount: string, newBalance: string }) {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Syne"
                    fallbackFontFamily="sans-serif"
                    webFont={{ url: 'https://fonts.gstatic.com/s/syne/v22/8vIQ7w4Mhni_c-o.woff2', format: 'woff2' }}
                />
            </Head>
            <Preview>Daily Earnings Confirmed</Preview>
            <Body style={{ backgroundColor: '#000000', color: '#ffffff', fontFamily: 'Syne, sans-serif' }}>
                <Container style={{ margin: '0 auto', padding: '40px 20px', maxWidth: '600px' }}>
                    <Section style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
                        <Img src={`${baseUrl}/logoImages/logo.png`} alt="Clover Hills" height="40" style={{ display: 'block', marginBottom: '10px' }} />
                        <Text style={{ fontSize: '12px', color: '#888', letterSpacing: '0.1em' }}>DAILY EARNINGS</Text>
                    </Section>
                    <Text style={{ fontSize: '16px', lineHeight: '24px' }}>
                        Your daily investment earnings have been processed and credited to your account.
                    </Text>
                    <Section style={{ backgroundColor: '#111', padding: '20px', margin: '30px 0', borderRadius: '8px' }}>
                        <Text style={{ fontSize: '14px', color: '#888', margin: 0 }}>EARNINGS TODAY</Text>
                        <Text style={{ fontSize: '32px', color: '#90EE90', margin: '0 0 20px 0' }}>+${amount}</Text>

                        <Text style={{ fontSize: '14px', color: '#888', margin: 0 }}>AVAILABLE BALANCE</Text>
                        <Text style={{ fontSize: '24px', color: '#fff', margin: 0 }}>${newBalance}</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
