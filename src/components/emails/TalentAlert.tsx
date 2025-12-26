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

export interface TalentAlertEmailProps {
    recruiterName: string;
    candidates: {
        role: string;
        experience: string;
        location: string;
        link: string;
    }[];
    texts: {
        preview: string;
        greeting: string;
        intro: string;
        button: string;
        footer_reason: string;
        unsubscribe: string;
    };
    links: {
        settings: string;
        home: string;
    };
}

export const TalentAlertEmail = ({
    recruiterName,
    candidates,
    texts,
    links
}: TalentAlertEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>{texts.preview}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Link href={links.home} style={logo}>tintel</Link>
                    </Section>
                    <Heading style={heading}>{texts.greeting}</Heading>
                    <Text style={paragraph}>
                        {texts.intro}
                    </Text>

                    <Hr style={hr} />

                    {candidates.map((candidate, i) => (
                        <Section key={i} style={candidateSection}>
                            <Text style={candidateRole}>{candidate.role}</Text>
                            <Text style={candidateDetail}>{candidate.experience} • {candidate.location}</Text>
                            <Button
                                style={button}
                                href={candidate.link}
                            >
                                {texts.button}
                            </Button>
                        </Section>
                    ))}

                    <Hr style={hr} />

                    <Text style={footer}>
                        {texts.footer_reason}
                        <br />
                        <Link href={links.settings} style={link}>
                            {texts.unsubscribe}
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Styles (Reusing consistent styles)
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
    color: '#000000', // Darker for Recruiter/B2B feel
    textDecoration: 'none',
};

const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#1a1a1a',
    padding: '17px 0 0',
};

const paragraph = {
    margin: '0 0 15px',
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#444444',
};

const button = {
    backgroundColor: '#000000', // Black for premium B2B
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px 24px',
    marginTop: '10px',
};

const candidateSection = {
    padding: '20px 0',
    borderLeft: '2px solid #eaeaea',
    paddingLeft: '16px',
    marginBottom: '16px',
};

const candidateRole = {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0',
    color: '#111',
};

const candidateDetail = {
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

const link = {
    color: '#000',
    textDecoration: 'underline',
};

export default TalentAlertEmail;
