import { Html, Head, Preview, Body, Container, Section, Text, Img, Font, Button } from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clovercapitalhills.com';

export default function PeriodEndReminderEmail({
    fullName,
    daysRemaining,
    planName,
    amount
}: {
    fullName: string;
    daysRemaining: number;
    planName: string;
    amount: string;
}) {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Syne"
                    fallbackFontFamily="sans-serif"
                    webFont={{ url: 'https://fonts.gstatic.com/s/syne/v22/8vIQ7w4Mhni_c-o.woff2', format: 'woff2' }}
                />
            </Head>
            <Preview>Your investment period is nearing its end</Preview>
            <Body style={{ backgroundColor: '#000000', color: '#ffffff', fontFamily: 'Syne, sans-serif' }}>
                <Container style={{ margin: '0 auto', padding: '40px 20px', maxWidth: '600px' }}>
                    <Section style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
                        <Img src={`${baseUrl}/logoImages/logo.png`} alt="Clover Hills" height="40" style={{ display: 'block', marginBottom: '10px' }} />
                        <Text style={{ fontSize: '12px', color: '#888', letterSpacing: '0.1em' }}>STRATEGY EXPIRATION NOTICE</Text>
                    </Section>

                    <Text style={{ fontSize: '16px', lineHeight: '24px' }}>
                        Hello {fullName || 'Investor'},
                    </Text>

                    <Text style={{ fontSize: '16px', lineHeight: '24px' }}>
                        Your current deployment in the <strong>{planName}</strong> is scheduled to conclude in <strong>{daysRemaining} days</strong>.
                    </Text>

                    <Section style={{ border: '1px solid #333', padding: '30px', margin: '35px 0' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <Text style={{ fontSize: '11px', color: '#888', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Active Capital</Text>
                            <Text style={{ fontSize: '28px', color: '#fff', margin: 0 }}>${amount}</Text>
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <Text style={{ fontSize: '11px', color: '#888', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Expiring In</Text>
                            <Text style={{ fontSize: '20px', color: '#90EE90', margin: 0 }}>{daysRemaining} {daysRemaining === 1 ? 'Day' : 'Days'}</Text>
                        </div>

                        <Button
                            href={`${baseUrl}/dashboard`}
                            style={{
                                backgroundColor: '#fff',
                                color: '#000',
                                padding: '15px 30px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.2em',
                                display: 'inline-block',
                                textAlign: 'center' as const,
                                textDecoration: 'none'
                            }}
                        >
                            Top-up to Renew Term
                        </Button>
                    </Section>

                    <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#888', marginTop: '40px' }}>
                        To prevent a pause in your daily yields, we recommend topping up your capital to renew the investment period. You can do this directly from your dashboard.
                    </Text>

                    <Text style={{ fontSize: '12px', color: '#444', marginTop: '40px', borderTop: '1px solid #222', paddingTop: '20px' }}>
                        If no action is taken, your capital will be returned to your available balance upon expiration of the term.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}
