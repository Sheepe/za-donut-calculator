import {
    ActionIcon,
    Badge,
    Flex,
    Group,
    Stack,
    Text,
    useMantineTheme,
} from "@mantine/core"
import {
    BERRY_DATA,
    type Berry,
    type BerryType,
    type DonutProfile,
} from "../../donut_data"
import BerryColorSquare from "../berry/BerryColorSquare"
import { FaSave } from "react-icons/fa"
import { FaCheckDouble } from "react-icons/fa6"
import { canUseDonut, type BerryStorage } from "../app/App"

interface DonutDisplayProps {
    profile: DonutProfile
    berries: [BerryType, Berry, number][]
    optimal?: boolean
    onSave: () => void
    applyDonut: (v: [BerryType, Berry, number][]) => void
    berryStorage: BerryStorage
}

const SolutionDonut = ({
    profile,
    berries,
    optimal = false,
    onSave,
    applyDonut,
    berryStorage,
}: DonutDisplayProps) => {
    const theme = useMantineTheme()

    return (
        <Flex
            p="xs"
            w="100%"
            bg="gray"
            bdrs="md"
            gap="xs"
            direction="row"
            pb="md"
            key={Math.random()}
            style={{ position: "relative" }}
        >
            {optimal ? (
                <Badge
                    style={{ position: "absolute", zIndex: 5 }}
                    top="-1em"
                    right="-1em"
                    color="green"
                >
                    BEST
                </Badge>
            ) : (
                <></>
            )}
            <Stack w="100%" gap="xs" m=".2em" mb="0px">
                <Group gap="xs">
                    {profile.map((v, i) => {
                        return (
                            <Badge color={theme.colors.donut[i]} size="md">
                                {v}
                            </Badge>
                        )
                    })}
                </Group>
                <Flex w="100%" gap="sm" direction="column">
                    {berries.map((v, i) => {
                        return (
                            <Group>
                                <BerryColorSquare
                                    colors={BERRY_DATA[v[0]][v[1]].colors}
                                />
                                <Group gap="xs" align="center" key={i}>
                                    <Text fw={900} size="sm" pl={0}>
                                        {`x${v[2]}`}
                                    </Text>
                                    <Text
                                        tt={"capitalize"}
                                        fw={600}
                                        size="sm"
                                        pl={0}
                                    >
                                        {`${v[0] === "normal" ? "" : "Hyper "}${
                                            v[1]
                                        } Berry`}
                                    </Text>
                                </Group>
                            </Group>
                        )
                    })}
                </Flex>
            </Stack>
            <Stack w="50px" align="flex-end" gap="xs">
                <ActionIcon size="lg" color="gray" onClick={onSave}>
                    <FaSave size={20} />
                </ActionIcon>
                {canUseDonut(berryStorage, berries) ? (
                    <ActionIcon
                        size="lg"
                        color="gray"
                        onClick={() => applyDonut(berries)}
                    >
                        <FaCheckDouble size={20} />
                    </ActionIcon>
                ) : (
                    <></>
                )}
            </Stack>
        </Flex>
    )
}

export default SolutionDonut
