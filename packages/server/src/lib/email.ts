import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.spacemail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2',
  },
});

export async function sendVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@gongren.xyz',
      to: email,
      subject: '鞍钢 — 邮箱验证码',
      html: `
        <div style="max-width:480px;margin:0 auto;padding:32px;background:#1a1a2e;color:#e0e0e0;font-family:system-ui,sans-serif;border-radius:8px;">
          <h2 style="color:#c9a84c;text-align:center;letter-spacing:4px;">鞍钢 · 共享世界</h2>
          <div style="width:48px;height:2px;background:#c9a84c;margin:16px auto;"></div>
          <p style="text-align:center;font-size:14px;">你的邮箱验证码是：</p>
          <div style="text-align:center;font-size:32px;font-weight:bold;letter-spacing:8px;color:#c9a84c;margin:24px 0;">${code}</div>
          <p style="text-align:center;font-size:12px;color:#888;">验证码 10 分钟内有效，请勿转发给他人</p>
          <div style="width:48px;height:1px;background:#333;margin:24px auto;"></div>
          <p style="text-align:center;font-size:11px;color:#555;">全世界无产阶级万岁</p>
        </div>
      `,
    });
    return true;
  } catch (err: any) {
    console.error('Send email error:', err?.message || err, err?.code || '');
    return false;
  }
}
