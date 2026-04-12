import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomeEmail from '@/emails/WelcomeEmail';
import AdminActionEmail from '@/emails/AdminActionEmail';
import DailyRoiEmail from '@/emails/DailyRoiEmail';
import NewInvestmentEmail from '@/emails/NewInvestmentEmail';
import TransactionRequestEmail from '@/emails/TransactionRequestEmail';
import AccountActivatedEmail from '@/emails/AccountActivatedEmail';
import * as React from 'react';

// Initialize with environment key - safe on server functions
const resend = new Resend(process.env.RESEND_API_KEY || "missing_key");
const senderEmail = 'Clover Hills <noreply@clovercapitalhills.com>';

export async function sendTransactionRequestEmail(to: string, type: 'deposit' | 'withdrawal', amount: string) {
    if (!process.env.RESEND_API_KEY) return;
    try {
        const html = await render(React.createElement(TransactionRequestEmail, { type, amount }));
        await resend.emails.send({
            from: senderEmail,
            to: [to],
            subject: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} Request Received — Clover Hills`,
            html
        });
    } catch (err) { console.error('Failed to send transaction email:', err); }
}

export async function sendNewInvestmentEmail(to: string, amount: string, planName: string) {
    if (!process.env.RESEND_API_KEY) return;
    try {
        const html = await render(React.createElement(NewInvestmentEmail, { amount, planName }));
        await resend.emails.send({
            from: senderEmail,
            to: [to],
            subject: 'Capital Deployment Confirmed — Clover Hills',
            html
        });
    } catch (err) { console.error('Failed to send investment email:', err); }
}

export async function sendWelcomeEmail(to: string, fullName: string) {
    if (!process.env.RESEND_API_KEY) return;
    try {
        const html = await render(React.createElement(WelcomeEmail, { fullName }));
        await resend.emails.send({
            from: senderEmail,
            to: [to],
            subject: 'Application Received — Clover Hills',
            html
        });
    } catch (err) { console.error('Failed to send welcome email:', err); }
}

export async function sendAdminActionEmail(to: string, actionType: string, details: string) {
    if (!process.env.RESEND_API_KEY) return;
    try {
        const html = await render(React.createElement(AdminActionEmail, { actionType, details }));
        await resend.emails.send({
            from: senderEmail,
            to: [to],
            subject: 'Account Update — Clover Hills',
            html
        });
    } catch (err) { console.error('Failed to send admin update email:', err); }
}

export async function sendBulkDailyRoiEmail(users: { email: string; amount: string; newBalance: string }[]) {
    if (!process.env.RESEND_API_KEY || users.length === 0) return;
    try {
        // Resend Supports batch sending natively
        const batch = await Promise.all(users.map(async (user) => {
            const html = await render(React.createElement(DailyRoiEmail, { amount: user.amount, newBalance: user.newBalance }));
            return {
                from: senderEmail,
                to: [user.email],
                subject: 'Daily Yield Processed — Clover Hills',
                html
            };
        }));

        // Chunk batch into groups of 100 to respect Resend rate limits
        for (let i = 0; i < batch.length; i += 100) {
            await resend.batch.send(batch.slice(i, i + 100));
        }
    } catch (err) { console.error('Failed to send daily ROI emails:', err); }
}

export async function sendAccountActivatedEmail(to: string, fullName: string) {
    if (!process.env.RESEND_API_KEY) return;
    try {
        const html = await render(React.createElement(AccountActivatedEmail, { fullName }));
        await resend.emails.send({
            from: senderEmail,
            to: [to],
            subject: 'Account Activated — Clover Hills',
            html
        });
    } catch (err) { console.error('Failed to send activation email:', err); }
}
