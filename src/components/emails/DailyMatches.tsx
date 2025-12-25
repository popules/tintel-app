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

interface DailyMatchesEmailProps {
    userName: string;
    matches: {
        title: string;
        company: string;
        location: string;
        link: string;
    }[];
}

export const DailyMatchesEmail = ({
    userName,
    matches,
}) => (
    <Html>
        <Head />
        <Preview>We found {matches.length} new jobs for you on Tintel!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Text style={logo}>tintel</Text>
                </Section>
                <Heading style={heading}>Hej {userName}! 👋</Heading>
                <Text style={paragraph}>
                    Nu händer det grejer. Vi har hittat <strong>{matches.length} nya jobb</strong> som matchar din profil perfekt.
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
                            Visa jobb
                        </Button>
                    </Section>
                ))}

                <Hr style={hr} />

                <Text style={footer}>
                    Du får detta mail för att du har skapat en profil på Tintel.se.
                    <br />
                    För att ändra dina notiser, logga in på din dashboard.
                </Text>
            </Container>
        </Body>
    </Html>
);

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
