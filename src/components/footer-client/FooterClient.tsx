"use client";

import { ActionIcon, Container, Group, rem } from "@mantine/core";
import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from "@tabler/icons-react";
import useRouter from "@/hooks/use-router-custom";
import { LogoIcon } from "../logo/LogoIcon";
import classes from "./FooterClient.module.css";
import Text from "../custom/text-custom/TextCustom";
import { TITLE } from "@/constant/app.constant";
import { useTranslations } from "next-intl";

const data = [
   {
      title: "About",
      links: [
         { label: "Features", link: "#" },
         { label: "Pricing", link: "#" },
         { label: "Support", link: "#" },
         { label: "Forums", link: "#" },
      ],
   },
   {
      title: "Project",
      links: [
         { label: "Contribute", link: "#" },
         { label: "Media assets", link: "#" },
         { label: "Changelog", link: "#" },
         { label: "Releases", link: "#" },
      ],
   },
   {
      title: "Community",
      links: [
         { label: "Join Discord", link: "#" },
         { label: "Follow on Twitter", link: "#" },
         { label: "Email newsletter", link: "#" },
         { label: "GitHub discussions", link: "login" },
      ],
   },
];

export default function FooterClient() {
   const router = useRouter();
   const t = useTranslations()

   const groups = data.map((group) => {
      const links = group.links.map((link, index) => (
         <Text
            key={index}
            className={classes.link}
            onClick={() => {
               router.push(link.link);
            }}
            style={{ cursor: `pointer` }}
         >
            {link.label}
         </Text>
      ));

      return (
         <div className={classes.wrapper} key={group.title}>
            <Text className={classes.title}>{group.title}</Text>
            {links}
         </div>
      );
   });

   return (
      <footer className={classes.footer}>
         <Container className={classes.inner}>
            <div className={classes.logo}>
               <LogoIcon />
               <Text size="xs" c="dimmed" className={classes.description}>
                  Build fully 1
               </Text>
            </div>
            <div className={classes.groups}>{groups}</div>
         </Container>
         <Container className={classes.afterFooter}>
            <Text c="dimmed" size="sm">
               © 2025 {TITLE}. {t(`All rights reserved`)}.
            </Text>

            <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
               <ActionIcon size="lg" color="gray" variant="subtle" radius="xl">
                  <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
               </ActionIcon>
               <ActionIcon size="lg" color="gray" variant="subtle" radius="xl">
                  <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
               </ActionIcon>
               <ActionIcon size="lg" color="gray" variant="subtle" radius="xl">
                  <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
               </ActionIcon>
            </Group>
         </Container>
      </footer>
   );
}
