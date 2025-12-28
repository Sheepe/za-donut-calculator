import {
    Accordion,
    Group,
    Text,
    type DefaultMantineColor,
    type StyleProp,
} from "@mantine/core"
import type { PropsWithChildren } from "react"

export interface OptionProps extends PropsWithChildren {
    name: string
    backgroundColor: StyleProp<DefaultMantineColor>
    textColor: StyleProp<DefaultMantineColor>
    header?: React.ReactNode
}

const Option = ({
    name,
    textColor,
    backgroundColor,
    header,
    children,
}: OptionProps) => {
    return (
        <Accordion.Item
            key={name.toLowerCase()}
            value={name.toLowerCase()}
            w="100%"
            bg={backgroundColor}
            bdrs="lg"
            p="xs"
            mt="xs"
            style={{ ["--chev" as any]: textColor }}
        >
            <Accordion.Control
                bg={backgroundColor}
                p={0}
                m={0}
                styles={{
                    chevron: { color: "var(--chev)" },
                }}
            >
                <Group>
                    <Text
                        size="md"
                        c={textColor}
                        fw={700}
                        mb="0px"
                        pl="sm"
                        w={header === undefined ? "50%" : "70px"}
                    >
                        {name.toUpperCase()}
                    </Text>

                    {header}
                </Group>
            </Accordion.Control>
            <Accordion.Panel p={0}>{children}</Accordion.Panel>
        </Accordion.Item>
    )
}

export default Option
