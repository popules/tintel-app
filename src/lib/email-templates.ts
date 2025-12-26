
export const getDailyMatchesHtml = (props: {
    userName: string;
    matches: {
        title: string;
        company: string;
        location: string;
        link: string;
    }[];
    texts: {
        preview: string;
        greeting: string;
        pre_summary: string;
        post_summary: string;
        button: string;
        reason: string;
        settings: string;
        unsubscribe: string;
    };
    links: {
        settings: string;
        home: string;
    };
}) => {
    const { userName, matches, texts, links } = props;

    // Styles
    const main = `font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif; background-color: #ffffff;`;
    const container = `margin: 0 auto; padding: 20px 0 48px; max-width: 580px;`;
    const header = `padding: 32px 0;`;
    const logo = `font-size: 24px; font-weight: bold; letter-spacing: -1px; margin: 0; color: #4f46e5; text-decoration: none;`;
    const heading = `font-size: 24px; letter-spacing: -0.5px; line-height: 1.3; font-weight: 700; color: #484848; padding: 17px 0 0;`;
    const paragraph = `margin: 0 0 15px; font-size: 16px; line-height: 1.4; color: #3c4149;`;
    const button = `background-color: #4f46e5; border-radius: 8px; color: #fff; font-size: 14px; font-weight: bold; text-decoration: none; text-align: center; display: block; padding: 12px 24px; margin-top: 10px;`;
    const jobSection = `padding: 20px 0; border-top: 1px solid #e6ebf1;`;
    const jobTitle = `font-size: 18px; font-weight: bold; margin: 0;`;
    const jobCompany = `font-size: 14px; color: #666; margin: 4px 0 12px;`;
    const footer = `color: #8898aa; font-size: 12px; line-height: 16px; margin-top: 20px; border-top: 1px solid #e6ebf1; padding-top: 20px;`;
    const linkStyle = `color: #4f46e5; text-decoration: underline;`;

    const jobRows = matches.map(job => `
        <div style="${jobSection}">
            <p style="${jobTitle}">${job.title}</p>
            <p style="${jobCompany}">${job.company} • ${job.location}</p>
            <a href="${job.link}" style="${button}">${texts.button}</a>
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${texts.preview}</title>
</head>
<body style="${main}">
    <div style="${container}">
        <div style="${header}">
            <a href="${links.home}" style="${logo}">tintel</a>
        </div>
        <h1 style="${heading}">${texts.greeting}</h1>
        <p style="${paragraph}">
            ${texts.pre_summary} <strong>${matches.length}</strong> ${texts.post_summary}
        </p>

        ${jobRows}

        <div style="${footer}">
            ${texts.reason}<br />
            ${texts.settings} <a href="${links.settings}" style="${linkStyle}">${texts.unsubscribe}</a>
        </div>
    </div>
</body>
</html>
    `;
};

export const getTalentAlertHtml = (props: {
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
}) => {
    const { recruiterName, candidates, texts, links } = props;

    // Recruiter specific styles (Black/White premium)
    const main = `font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif; background-color: #ffffff;`;
    const container = `margin: 0 auto; padding: 20px 0 48px; max-width: 580px;`;
    const header = `padding: 32px 0;`;
    const logo = `font-size: 24px; font-weight: bold; letter-spacing: -1px; margin: 0; color: #000000; text-decoration: none;`;
    const heading = `font-size: 24px; letter-spacing: -0.5px; line-height: 1.3; font-weight: 700; color: #1a1a1a; padding: 17px 0 0;`;
    const paragraph = `margin: 0 0 15px; font-size: 16px; line-height: 1.4; color: #444444;`;
    const button = `background-color: #000000; border-radius: 6px; color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; text-align: center; display: block; padding: 12px 24px; margin-top: 10px;`;
    const candidateSection = `padding: 20px 0; border-left: 2px solid #eaeaea; padding-left: 16px; margin-bottom: 16px;`;
    const roleTitle = `font-size: 18px; font-weight: bold; margin: 0; color: #111;`;
    const detail = `font-size: 14px; color: #666; margin: 4px 0 12px;`;
    const footer = `color: #8898aa; font-size: 12px; line-height: 16px; margin-top: 20px; border-top: 1px solid #e6ebf1; padding-top: 20px;`;
    const linkStyle = `color: #000000; text-decoration: underline;`;

    const candidateRows = candidates.map(c => `
        <div style="${candidateSection}">
            <p style="${roleTitle}">${c.role}</p>
            <p style="${detail}">${c.experience} • ${c.location}</p>
            <a href="${c.link}" style="${button}">${texts.button}</a>
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${texts.preview}</title>
</head>
<body style="${main}">
    <div style="${container}">
        <div style="${header}">
            <a href="${links.home}" style="${logo}">tintel</a>
        </div>
        <h1 style="${heading}">${texts.greeting}</h1>
        <p style="${paragraph}">
            ${texts.intro}
        </p>

        ${candidateRows}

        <div style="${footer}">
            ${texts.footer_reason}<br />
            <a href="${links.settings}" style="${linkStyle}">${texts.unsubscribe}</a>
        </div>
    </div>
</body>
</html>
    `;
};
