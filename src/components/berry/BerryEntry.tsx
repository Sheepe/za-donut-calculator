import { ActionIcon, Flex, Group, NumberInput, Text } from "@mantine/core"
import type { PropsWithChildren } from "react"
import { FaMinus, FaPlus } from "react-icons/fa6"

interface BerryEntryProps extends PropsWithChildren {
    name: string
    variable: [number, (v: number) => any, any]
}

const BerryEntry = ({ name, children, variable }: BerryEntryProps) => {
    return (
        <Group
            bg="gray"
            key={name}
            p="sm"
            gap="xs"
            bdrs="lg"
            maw="300px"
            w="100%"
            justify="center"
        >
            <Flex w="100%" gap="sm" maw="90px">
                {children}
                <Text tt={"capitalize"} fw={600} size="sm" pl={0}>
                    {name}
                </Text>
            </Flex>

            <Flex w="100%" align="center" justify="center" gap="xs" maw="128px">
                <ActionIcon
                    color="green"
                    radius="lg"
                    onClick={() => variable[1](Math.min(999, variable[0] + 1))}
                >
                    <FaPlus />
                </ActionIcon>
                <NumberInput
                    hideControls
                    allowDecimal={false}
                    allowNegative={false}
                    radius="xl"
                    size="sm"
                    min={0}
                    max={999}
                    style={{
                        textAlign: "center",
                    }}
                    fw={700}
                    value={variable[0]}
                    onChange={(v) => variable[1](Number(v))}
                />
                <ActionIcon
                    color="red"
                    radius="lg"
                    onClick={() => variable[1](Math.max(0, variable[0] - 1))}
                >
                    <FaMinus />
                </ActionIcon>
            </Flex>
        </Group>
    )
}

export default BerryEntry
