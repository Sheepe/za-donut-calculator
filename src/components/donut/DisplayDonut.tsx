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
    DONUT_TYPES,
    type Berry,
    type BerryType,
    type DonutProfile,
    type SavedDonut,
} from "../../donut_data"
import { FaCheckDouble, FaShareFromSquare, FaTrashCan } from "react-icons/fa6"
import BerryColorSquare from "../berry/BerryColorSquare"
import { canUseDonut, type BerryStorage } from "../app/App"
import { notifications } from "@mantine/notifications"
import { useClipboard } from "@mantine/hooks"

interface DisplayDonutProps {
    name: string
    id: number
    profile: DonutProfile
    berries: [BerryType, Berry, number][]
    controls?: boolean
    berryStorage: BerryStorage
    applyDonut: (v: [BerryType, Berry, number][]) => void
    savedDonuts: SavedDonut[]
    setSavedDonuts: (v: SavedDonut[]) => void
}

const profiles = ["Meringue", "Curry", "Jam", "Chocolate", "Cream"]
const capitalize = (s: string) =>
    s && String(s[0]).toUpperCase() + String(s).slice(1)

// const getSavedDonut

const DisplayDonut = ({
    name,
    profile,
    berries,
    controls = true,
    berryStorage,
    applyDonut,
    savedDonuts,
    id,
    setSavedDonuts,
}: DisplayDonutProps) => {
	const clipboard = useClipboard({ timeout: 2500 });
    const theme = useMantineTheme()
    const map = new Map()
    let donutType = ""
    let best = 0

    for (let i = 0; i < profile.length; i++) {
        if (map.get(profile[i]) === undefined) {
            map.set(profile[i], 1)
        } else {
            map.set(profile[i], map.get(profile[i]) + 1)
        }
        if (profile[i] > best) {
            best = profile[i]
            donutType = profiles[i]
        }
    }

    if (map.get(best) > 1) {
        donutType = "Rainbow"
    }

    return (
        <Flex
            p="xs"
            w="100%"
            bg="gray"
            bdrs="md"
            gap="xs"
            direction="row"
            mb="xs"
            pb="md"
            key={name + id}
        >
            <Stack w="100%" gap={0} mx="xs">
                <Text fw={650} maw="230px" p="0px" size="lg" h="25px" truncate>
                    {name}
                </Text>
                <Text
                    fw={550}
                    w="100%"
                    p="0px"
                    mb="xs"
                    h="5px"
                    size="xs"
                    c="dimmed"
                >
                    {`${donutType} Donut`}
                </Text>
                <Group gap="xs" my="xs">
                    {profile.map((v, i) => {
                        return (
                            <Badge color={theme.colors.donut[i]} size="lg">
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
            {controls ? (
                <Stack w="50px" align="flex-end" gap="xs">
                    <ActionIcon
                        size="lg"
                        color="gray"
                        onClick={() => {
                            const donuts = savedDonuts.slice()
                            donuts.splice(id, 1)
                            setSavedDonuts(donuts)
                            notifications.show({
                                title: "Donut Deleted",
                                color: "red",
                                message: `"${name}" has been deleted`,
                                autoClose: 1500,
                                withCloseButton: true,
                            })
                        }}
                    >
                        <FaTrashCan size={20} />
                    </ActionIcon>
                    <ActionIcon
                        size="lg"
                        color="gray"
                        onClick={() => {
                            let string = `Donut "${name}"\nProfile: ${profile
                                .map((v, i) => `${capitalize(DONUT_TYPES[i])} ${v}`)
                                .join(", ")}\nBerries:\n`
                            for (let i = 0; i < berries.length; i++) {
                                const berry = berries[i]
                                string += ` - x${berry[2]} ${capitalize(
                                    berry[0]
                                )} ${capitalize(berry[1])} Berry`
								if (i !== (berries.length -1)) {
									string += "\n"
								}
                            }
                            notifications.show({
                                title: "Donut Copied",
                                color: "blue",
                                message: `Donut "${name}" copied to clipboard`,
                                autoClose: 2000,
                                withCloseButton: true,
                            })
							clipboard.copy(string)
                        }}
						disabled={clipboard.copied}
                    >
                        <FaShareFromSquare size={20} />
                    </ActionIcon>
                    {canUseDonut(berryStorage, berries) ? (
                        <ActionIcon
                            size="lg"
                            color="gray"
                            onClick={() => {
                                if (!canUseDonut(berryStorage, berries)) return
                                applyDonut(berries)
                            }}
                        >
                            <FaCheckDouble size={20} />
                        </ActionIcon>
                    ) : (
                        <></>
                    )}
                </Stack>
            ) : (
                <></>
            )}
        </Flex>
    )
}

export default DisplayDonut
