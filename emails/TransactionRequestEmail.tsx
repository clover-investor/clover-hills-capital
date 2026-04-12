import { Html, Head, Preview, Body, Container, Section, Text, Img, Font } from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clovercapitalhills.com';

export default function TransactionRequestEmail({ type, amount }: { type: 'deposit' | 'withdrawal', amount: string }) {
    const isDeposit = type === 'deposit';

    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Syne"
                    fallbackFontFamily="sans-serif"
                    webFont={{ url: 'https://fonts.gstatic.com/s/syne/v22/8vIQ7w4Mhni_c-o.woff2', format: 'woff2' }}
                />
            </Head>
            <Preview>{isDeposit ? 'Deposit' : 'Withdrawal'} Request Received</Preview>
            <Body style={{ backgroundColor: '#000000', color: '#ffffff', fontFamily: 'Syne, sans-serif' }}>
                <Container style={{ margin: '0 auto', padding: '40px 20px', maxWidth: '600px' }}>
                    <Section style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
                        <Img src={`${baseUrl}/logoImages/logo.png`} alt="Clover Hills" height="40" style={{ display: 'block', marginBottom: '10px' }} />
                        <Text style={{ fontSize: '12px', color: '#888', letterSpacing: '0.1em' }}>
                            {isDeposit ? 'DEPOSIT INITIATED' : 'WITHDRAWAL INITIATED'}
                        </Text>
                    </Section>
                    <Text style={{ fontSize: '16px', lineHeight: '24px' }}>
                        We have received a request to {isDeposit ? 'add funds to' : 'withdraw funds from'} your Clover Hills account.
                    </Text>
                    <Section style={{ backgroundColor: '#111', padding: '20px', margin: '30px 0', borderRadius: '8px' }}>
                        <Text style={{ fontSize: '14px', color: '#888', margin: 0 }}>
                            {isDeposit ? 'DEPOSIT AMOUNT' : 'WITHDRAWAL AMOUNT'}
                        </Text>
                        <Text style={{ fontSize: '24px', color: isDeposit ? '#90EE90' : '#fff', margin: 0 }}>
                            ${amount}
                        </Text>
                    </Section>
                    <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#888', marginTop: '40px' }}>
                        {isDeposit
                            ? 'To complete this transaction, please ensure you have transferred the correct funds to the crypto wallet provided on the platform. Your balance will be updated automatically once the transaction is verified on the blockchain.'
                            : 'Our finance team is reviewing your withdrawal request. Please allow 2-24 hours for standard processing. You will receive another notification once the funds are released.'}
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}
