import { Accordion, Divider, Text } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import type { PropsWithChildren } from "react"

interface AppSectionProps extends PropsWithChildren {
    name: string
    defaultOpen?: string | null
}

const AppSection = ({
    name,
    defaultOpen = name,
    children,
}: AppSectionProps) => {
    const [open, setOpen] = useLocalStorage({
        key: `${name}-section-open`,
        defaultValue: defaultOpen,
    })

    return (
        <Accordion
            variant="unstyled"
            value={open}
            onChange={setOpen}
            key={name}
        >
            <Accordion.Item key={name} value={name}>
                <Accordion.Control>
                    <Divider
                        mx="lg"
                        labelPosition="left"
                        label={
                            <Text
                                size="md"
                                c="white"
                                fw={600}
                                component="span"
                                tt="capitalize"
                            >
                                {name}
                            </Text>
                        }
                    />
                </Accordion.Control>
                <Accordion.Panel>{children}</Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}

export default AppSection
