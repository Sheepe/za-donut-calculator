import {
    Accordion,
    Button,
    Center,
    Checkbox,
    Flex,
    Group,
    Loader,
    Modal,
    Select,
    Slider,
    Space,
    Stack,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core"
import FlavourOption from "../options/FlavourOption"
import {
    useDisclosure,
    useLocalStorage,
    useMediaQuery,
    type UseStorageReturnValue,
} from "@mantine/hooks"
import Option from "../options/Option"
import {
    BERRY_DATA,
    DONUT_TYPES,
    type Berry,
    type BerryType,
    type DonutType,
    type SavedDonut,
} from "../../donut_data"
import BerryEntry from "../berry/BerryEntry"
import BerryColorSquare from "../berry/BerryColorSquare"
import DonutDisplay from "../donut/DisplayDonut"
import { useEffect, useState } from "react"
import { getDonutFromSolution, useSolutionRunner } from "../../solver/Solver"
import AppTitle from "./AppTitle"
import AppSection from "./AppSection"
import type { Goal } from "../../solver/solver.worker"
import { SolutionDonutList } from "../donut/SolutionDonutList"
import { notifications } from "@mantine/notifications"

interface DefaultSettings {
    flavour: Record<DonutType, Goal>
    useInventory: boolean
    maxBerries: string
    berryBias: number
    maxTimeout: string
    maxHeapSize: string
}

const defaultSettings: DefaultSettings = {
    flavour: {
        sweet: { mode: "exact", target: 420, weight: 1 },
        spicy: { mode: "min", target: 420, weight: 1 },
        sour: { mode: "min", target: 420, weight: 1 },
        bitter: { mode: "min", target: 420, weight: 1 },
        fresh: { mode: "min", target: 420, weight: 1 },
    },
    useInventory: false,
    maxBerries: "8",
    berryBias: 1,
    maxTimeout: "30000",
    maxHeapSize: "3000000",
}

export type BerryStorage = {
    normal: Record<string, UseStorageReturnValue<number>>
    hyper: Record<string, UseStorageReturnValue<number>>
}

export const canUseDonut = (
    berryStorage: BerryStorage,
    berries: [BerryType, Berry, number][]
) => {
    for (let i = 0; i < berries.length; i++) {
        const berryEntry = berries[i]
        const storage = berryStorage[berryEntry[0]][berryEntry[1]]

        if (storage[0] < berryEntry[2]) {
            return false
        }
    }

    return true
}

function App() {
    const theme = useMantineTheme()
    const isMobile = useMediaQuery("(max-width: 50em)")
    const [opened, { open, close }] = useDisclosure(false)

    const [savedDonuts, setSavedDonuts] = useLocalStorage<SavedDonut[]>({
        key: "saved-donuts",
        defaultValue: [],
    })

    const berryStorage: BerryStorage = {
        normal: {},
        hyper: {},
    }
    const berryInventory = []

    for (const berry in BERRY_DATA.normal) {
        const [berryAmount, setBerryAmount, _] = useLocalStorage({
            key: `${berry}-count`,
            defaultValue: 0,
        })

        berryStorage.normal[berry] = [berryAmount, setBerryAmount, _]
        berryInventory.push(berryAmount)
    }

    for (const berry in BERRY_DATA.hyper) {
        const [berryAmount, setBerryAmount, _] = useLocalStorage({
            key: `hyper-${berry}-count`,
            defaultValue: 0,
        })

        berryStorage.hyper[berry] = [berryAmount, setBerryAmount, _]
        berryInventory.push(berryAmount)
    }

    const flavourOptions = []
    const flavourGoals = []

    for (let i = 0; i < DONUT_TYPES.length; i++) {
        const flavour = DONUT_TYPES[i]
        const [flavourGoal, setFlavourGoal] = useLocalStorage<Goal>({
            key: `${flavour}-goal`,
            defaultValue: defaultSettings.flavour[flavour as DonutType],
        })
        flavourGoals.push(flavourGoal)
        flavourOptions.push(
            <FlavourOption
                name={flavour}
                backgroundColor={theme.colors.donut[i]}
                textColor={theme.colors.donut[i + 5]}
                goal={flavourGoal}
                onGoalChange={setFlavourGoal}
            />
        )
    }

    const [useInventory, setUseInventory] = useLocalStorage<boolean>({
        key: "use-inventory",
        defaultValue: defaultSettings.useInventory,
    })
    const [maxBerries, setMaxBerries] = useLocalStorage<string>({
        key: "max-berries",
        defaultValue: defaultSettings.maxBerries,
    })
    const [berryBias, setBerryBias] = useLocalStorage<number>({
        key: "berry-bias",
        defaultValue: defaultSettings.berryBias,
    })
    const [maxTimeout, setMaxTimeout] = useLocalStorage<string>({
        key: "max-timeout",
        defaultValue: defaultSettings.maxTimeout,
    })
    const [maxHeapSize, setMaxHeapSize] = useLocalStorage<string>({
        key: "max-timeout",
        defaultValue: defaultSettings.maxHeapSize,
    })

    const [draftBerryBias, setDraftBerryBias] = useState(berryBias)

    useEffect(() => {
        setDraftBerryBias(berryBias)
    }, [berryBias])

    const { solutions, done, playing, play, pause, reset, stats, speed } =
        useSolutionRunner({
            maxBerries: Number(maxBerries),
            inventoryEnabled: useInventory,
            goals: flavourGoals,
            maxTimeout: Number(maxTimeout),
            favorFewerVectors: 1 - berryBias,
            inventoryCaps: berryInventory,
            maxHeapSize: Number(maxHeapSize),
        })

    const subtractDonutFromBerries = (
        berries: [BerryType, Berry, number][]
    ) => {
        for (let i = 0; i < berries.length; i++) {
            const berryEntry = berries[i]
            const storage = berryStorage[berryEntry[0]][berryEntry[1]]

            storage[1](storage[0] - berryEntry[2])
        }

        notifications.show({
            title: "Inventory updated",
            color: "green",
            message: "",
            autoClose: 1500,
            withCloseButton: true,
        })
    }

    return (
        <Flex align="center" direction="column">
            <Flex
                w="80%"
                maw="700px"
                miw="350px"
                my="lg"
                justify="center"
                bg="dark"
                bdrs="lg"
            >
                <Stack w="100%" my="lg" gap={0}>
                    <AppTitle />
                    <Space h="lg" />
                    <AppSection name="instructions">
                        <Text mx="lg">
                            Input your desired flavour profile characteristics
                            below, and then the calculator will attempt to find
                            donuts which match your desired profile. You can
                            also input your current berries.
                        </Text>
                        <Space h="md" />
                        <Text mx="lg">
                            You can say whether a certain flavour should be
                            maximized or minimized, whether the calculator
                            should strictly try to match a specific value, or
                            get as close as possible.
                        </Text>
                        <Space h="md" />
                        <Text mx="lg">
                            Be aware that based on your settings, there may not
                            be any donuts possible.
                        </Text>
                    </AppSection>
                    <AppSection name="options">
                        <Flex direction="column" gap="sm" align="center">
                            <Accordion
                                w="90%"
                                styles={{
                                    content: { padding: 0 },
                                    label: { padding: 0 },
                                }}
                                p={0}
                                variant="filled"
                                defaultValue=""
                            >
                                {flavourOptions}
                                <Option
                                    name="ADVANCED"
                                    backgroundColor={theme.colors.app[8]}
                                    textColor="white"
                                >
                                    <Checkbox
                                        p="sm"
                                        pr="lg"
                                        pl="lg"
                                        label={
                                            <Text
                                                c={theme.colors.app[0]}
                                                size="sm"
                                                fw={650}
                                                component="span"
                                            >
                                                Use Berry Inventory
                                            </Text>
                                        }
                                        size="md"
                                        description={
                                            <Text
                                                c={theme.colors.app[2]}
                                                size="xs"
                                                component="span"
                                            >
                                                Only find solutions which you
                                                can make with the berries listed
                                            </Text>
                                        }
                                        color="gray"
                                        checked={useInventory}
                                        onChange={(v) =>
                                            setUseInventory(
                                                v.currentTarget.checked
                                            )
                                        }
                                    />
                                    <Select
                                        label={
                                            <Text
                                                c={theme.colors.app[0]}
                                                size="sm"
                                                fw={650}
                                                component="span"
                                            >
                                                Maximum Berries
                                            </Text>
                                        }
                                        description={
                                            <Text
                                                c={theme.colors.app[2]}
                                                size="xs"
                                                component="span"
                                            >
                                                Defines a maximum amount of
                                                berries to include in the donut
                                            </Text>
                                        }
                                        allowDeselect={false}
                                        value={maxBerries}
                                        onChange={(v) =>
                                            setMaxBerries(v === null ? "8" : v)
                                        }
                                        pr="lg"
                                        pl="lg"
                                        w="100%"
                                        data={["3", "4", "5", "6", "7", "8"]}
                                        radius="xl"
                                        checkIconPosition="right"
                                    />
                                    <Flex direction="column" px="lg" mt="sm">
                                        <Text
                                            c={theme.colors.app[0]}
                                            size="sm"
                                            fw={650}
                                            component="span"
                                        >
                                            Berry Bias
                                        </Text>
                                        <Text
                                            c={theme.colors.app[2]}
                                            size="xs"
                                            component="span"
                                        >
                                            How much the solver should try to
                                            minimize the number of berries
                                        </Text>
                                        <Slider
                                            w="100%"
                                            min={0}
                                            max={1}
                                            step={0.0005}
                                            px="xl"
                                            mt="xs"
                                            mb="lg"
                                            color="white"
                                            value={draftBerryBias}
                                            onChangeEnd={setBerryBias}
                                            onChange={setDraftBerryBias}
                                            label={null}
                                            marks={[
                                                {
                                                    value: 0,
                                                    label: (
                                                        <Text
                                                            c={
                                                                theme.colors
                                                                    .app[2]
                                                            }
                                                            size="xs"
                                                            component="span"
                                                        >
                                                            Fewer Berries
                                                        </Text>
                                                    ),
                                                },
                                                {
                                                    value: 0.5,
                                                    label: (
                                                        <Text
                                                            c={
                                                                theme.colors
                                                                    .app[2]
                                                            }
                                                            size="xs"
                                                            component="span"
                                                        >
                                                            Balanced
                                                        </Text>
                                                    ),
                                                },
                                                {
                                                    value: 1,
                                                    label: (
                                                        <Text
                                                            c={
                                                                theme.colors
                                                                    .app[2]
                                                            }
                                                            size="xs"
                                                            component="span"
                                                        >
                                                            More Berries
                                                        </Text>
                                                    ),
                                                },
                                            ]}
                                        />
                                    </Flex>
                                    <Select
                                        label={
                                            <Text
                                                c={theme.colors.app[0]}
                                                size="sm"
                                                fw={650}
                                                component="span"
                                            >
                                                Maximum Timeout
                                            </Text>
                                        }
                                        description={
                                            <Text
                                                c={theme.colors.app[2]}
                                                size="xs"
                                                component="span"
                                            >
                                                Defines how long the solver can
                                                search for between finding
                                                solutions
                                            </Text>
                                        }
                                        allowDeselect={false}
                                        value={maxTimeout}
                                        onChange={(v) =>
                                            setMaxTimeout(v ?? "30000")
                                        }
                                        pr="lg"
                                        pl="lg"
                                        mt="sm"
                                        mb="md"
                                        w="100%"
                                        data={[
                                            {
                                                value: "1000",
                                                label: "1 second",
                                            },
                                            {
                                                value: "5000",
                                                label: "5 seconds",
                                            },
                                            {
                                                value: "10000",
                                                label: "10 seconds",
                                            },
                                            {
                                                value: "30000",
                                                label: "30 seconds",
                                            },
                                            {
                                                value: "60000",
                                                label: "1 minute",
                                            },
                                            {
                                                value: "300000",
                                                label: "5 minutes",
                                            },
                                            {
                                                value: "Infinity",
                                                label: "Forever",
                                            },
                                        ]}
                                        radius="xl"
                                        checkIconPosition="right"
                                    />
                                    <Select
                                        label={
                                            <Text
                                                c={theme.colors.app[0]}
                                                size="sm"
                                                fw={650}
                                                component="span"
                                            >
                                                Maximum Heap Size
                                            </Text>
                                        }
                                        description={
                                            <Text
                                                c={theme.colors.app[2]}
                                                size="xs"
                                                component="span"
                                            >
                                                Limits how large the current
                                                list of donuts to check can get.
                                                This can cause an optimal
                                                solution to be missed if not set
                                                to Unlimited. Having it
                                                Unlimited can cause the browser
                                                to lag. If you're struggling to
                                                get an answer, try setting this
                                                to Unlimited.
                                            </Text>
                                        }
                                        allowDeselect={false}
                                        value={maxHeapSize}
                                        onChange={(v) =>
                                            setMaxHeapSize(v ?? "3000000")
                                        }
                                        pr="lg"
                                        pl="lg"
                                        mt="sm"
                                        mb="md"
                                        w="100%"
                                        data={[
                                            {
                                                value: "100000",
                                                label: "100K",
                                            },
                                            {
                                                value: "500000",
                                                label: "500K",
                                            },
                                            {
                                                value: "1000000",
                                                label: "1M",
                                            },
                                            {
                                                value: "3000000",
                                                label: "3M",
                                            },
                                            {
                                                value: "5000000",
                                                label: "5M",
                                            },
                                            {
                                                value: "10000000",
                                                label: "10M",
                                            },
                                            {
                                                value: "Infinity",
                                                label: "Unlimited",
                                            },
                                        ]}
                                        radius="xl"
                                        checkIconPosition="right"
                                    />
                                </Option>
                            </Accordion>
                        </Flex>
                    </AppSection>
                    <AppSection name="berry inventory" defaultOpen={null}>
                        <Text mx="lg">
                            You can input your current berry counts here and
                            choose whether to change them when a donut is found
                            for future searches.
                        </Text>
                        <Flex
                            w="100%"
                            justify="center"
                            pt="md"
                            direction="row"
                            gap="xs"
                        >
                            <Stack w="50%" gap="xs" align="center">
                                <Text fw={600}>Normal Berries</Text>
                                {(() => {
                                    let list = []
                                    for (const berry in BERRY_DATA.normal) {
                                        list.push(
                                            <BerryEntry
                                                name={berry}
                                                variable={
                                                    berryStorage.normal[berry]
                                                }
                                            >
                                                <BerryColorSquare
                                                    colors={
                                                        BERRY_DATA.normal[
                                                            berry as Berry
                                                        ]
                                                            .colors as readonly string[]
                                                    }
                                                />
                                            </BerryEntry>
                                        )
                                    }
                                    return list
                                })()}
                            </Stack>
                            <Stack w="50%" gap="xs" align="center">
                                <Text fw={600}>Hyper Berries</Text>
                                {(() => {
                                    let list = []
                                    for (const berry in BERRY_DATA.hyper) {
                                        list.push(
                                            <BerryEntry
                                                name={berry}
                                                variable={
                                                    berryStorage.hyper[berry]
                                                }
                                            >
                                                <BerryColorSquare
                                                    colors={
                                                        BERRY_DATA.hyper[
                                                            berry as Berry
                                                        ]
                                                            .colors as readonly string[]
                                                    }
                                                />
                                            </BerryEntry>
                                        )
                                    }
                                    return list
                                })()}
                            </Stack>
                        </Flex>
                    </AppSection>
                    <Modal.Root
                        opened={opened}
                        onClose={close}
                        h="100%"
                        size="100%"
                        fullScreen={isMobile}
                        transitionProps={{ transition: "fade", duration: 100 }}
                    >
                        <Modal.Overlay />
                        <Center>
                            <Modal.Content maw="450px" miw="350px">
                                <Modal.Header>
                                    <Modal.Title>Saved Donuts</Modal.Title>
                                    <Modal.CloseButton />
                                </Modal.Header>
                                <Modal.Body>
                                    {savedDonuts.length > 0 ? savedDonuts.map((v, i) => (
                                        <DonutDisplay
                                            name={v.name}
                                            profile={v.profile}
                                            berries={v.berries}
                                            berryStorage={berryStorage}
                                            applyDonut={
                                                subtractDonutFromBerries
                                            }
											savedDonuts={savedDonuts}
											setSavedDonuts={setSavedDonuts}
											id={i}
                                        />
                                    )) : <Text ta="center" w="100%" fw={600}>No donuts found</Text>}
                                </Modal.Body>
                            </Modal.Content>
                        </Center>
                    </Modal.Root>
                    <Group gap={"lg"} w="100%" p="md" justify="center">
                        <Button
                            color="green"
                            size="md"
                            maw="200px"
                            p="sm"
                            w="100%"
                            display={!playing && !done ? "block" : "none"}
                            onClick={play}
                        >
                            Start
                        </Button>
                        <Button
                            color="blue"
                            size="md"
                            maw="200px"
                            p="sm"
                            w="100%"
                            display={playing && !done ? "block" : "none"}
                            onClick={pause}
                        >
                            Pause
                        </Button>
                        <Button
                            color="red"
                            size="md"
                            maw="200px"
                            p="sm"
                            w="100%"
                            display={
                                (stats?.expanded ?? 0) > 0 ? "block" : "none"
                            }
                            onClick={reset}
                        >
                            Reset
                        </Button>
                        <Button
                            color="gray"
                            size="md"
                            p="sm"
                            maw="200px"
                            w="100%"
                            onClick={open}
                        >
                            Saved Donuts
                        </Button>
                    </Group>
                </Stack>
            </Flex>
            <Flex
                align="center"
                w="80%"
                maw="700px"
                miw="350px"
                bg="dark"
                bdrs="lg"
                mb="lg"
                direction="column"
                display={(stats?.expanded ?? 0) > 0 ? "flex" : "none"}
            >
                <Title ta="center" order={4} mx="sm" mt="lg">
                    {solutions.length === 0
                        ? "No Solutions Found"
                        : `${solutions.length} Solution${
                              solutions.length === 1 ? "" : "s"
                          } Found`}
                </Title>
                <Text
                    ta="center"
                    mx="sm"
                    c="dimmed"
                    fw={600}
                    size="xs"
                    display={!done ? "block" : "none"}
                >
                    {playing
                        ? `${stats?.expanded.toLocaleString()} branches explored, ${stats?.heapSize.toLocaleString()} nodes remaining, checking ${Math.floor(
                              speed
                          ).toLocaleString()} nodes/sec`
                        : `Paused`}
                </Text>
                <Loader
                    color="white"
                    type="dots"
                    display={playing ? "flex" : "none"}
                />
                <SolutionDonutList
                    solutions={solutions}
                    stats={stats}
                    getDonutFromSolution={getDonutFromSolution}
                    height={500}
                    savedDonuts={savedDonuts}
                    setSavedDonuts={setSavedDonuts}
                    applyDonut={subtractDonutFromBerries}
                    berryStorage={berryStorage}
                />
            </Flex>
        </Flex>
    )
}

export default App
