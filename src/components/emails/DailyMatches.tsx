import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Button,
} from '@react-email/components';
import * as React from 'react';
import { en } from '@/locales/en';
import { sv } from '@/locales/sv';

interface DailyMatchesEmailProps {
    userName: string;
    matches: {
        title: string;
        company: string;
        location: string;
        link: string;
    }[];
    locale?: 'en' | 'sv';
}

export const DailyMatchesEmail = ({
    userName,
    matches,
    locale = 'en',
}: DailyMatchesEmailProps) => {
    const translations = locale === 'sv' ? sv : en;
    const dict = translations.emails.daily_matches;

    return (
        <Html>
            <Head />
            <Preview>{dict.preview.replace('{{count}}', String(matches.length))}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={logo}>tintel</Text>
                    </Section>
                    <Heading style={heading}>{dict.greeting.replace('{{name}}', userName)}</Heading>
                    <Text style={paragraph}>
                        {dict.body_pre} <strong>{matches.length} {locale === 'sv' ? 'nya jobb' : 'new jobs'}</strong> {dict.body_post}
                    </Text>

                    <Hr style={hr} />

                    {matches.map((job, i) => (
                        <Section key={i} style={jobSection}>
                            <Text style={jobTitle}>{job.title}</Text>
                            <Text style={jobCompany}>{job.company} • {job.location}</Text>
                            <Button
                                style={button}
                                href={job.link}
                            >
                                {dict.button}
                            </Button>
                        </Section>
                    ))}

                    <Hr style={hr} />

                    <Text style={footer}>
                        {dict.footer_reason}
                        <br />
                        {dict.footer_settings}
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '580px',
};

const header = {
    padding: '32px 0',
};

const logo = {
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '-1px',
    margin: '0',
    color: '#4f46e5',
};

const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
    padding: '17px 0 0',
};

const paragraph = {
    margin: '0 0 15px',
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#3c4149',
};

const button = {
    backgroundColor: '#4f46e5',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px 24px',
    marginTop: '10px',
};

const jobSection = {
    padding: '20px 0',
};

const jobTitle = {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0',
};

const jobCompany = {
    fontSize: '14px',
    color: '#666',
    margin: '4px 0 12px',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
};

export default DailyMatchesEmail;
