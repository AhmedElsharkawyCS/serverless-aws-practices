import { useState, useEffect } from "react"
import { Button, Container, Text, Title, Modal, TextInput, Group, Card, ActionIcon, Code, ColorScheme } from "@mantine/core"
import { MoonStars, Sun, Trash } from "tabler-icons-react"
import { MantineProvider, ColorSchemeProvider } from "@mantine/core"
import { useHotkeys, useLocalStorage } from "@mantine/hooks"
import moment from "moment"

type Task = {
  id?: string
  title: string
  content: string
  expireAt?: string
  createdAt?: string
  userId?: string
}
export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [task, setTask] = useState<Task>({ title: "", content: "" })
  const [opened, setOpened] = useState(false)
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true
  })
  useHotkeys([["mod+J", () => toggleColorScheme()]])

  const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))

  const setTaskTitle = (title: string) => {
    setTask((pre) => ({ ...pre, title }))
  }
  const setTaskContent = (content: string) => {
    setTask((pre) => ({ ...pre, content }))
  }

  const createTask = () => {
    // submit the task to backend
    // append the task to the list
    setTasks((prv) => [
      ...prv,
      {
        id: Math.random().toString(),
        ...task,
        expireAt: moment().add(1, "days").unix().toString(),
        createdAt: moment().unix().toString()
      }
    ])
  }
  const deleteTask = (index: number) => {
    const item = tasks[index]
    // delete the task from the backend as well
    const newTasks = tasks.filter(({ id }) => id !== item.id)
    setTasks(newTasks)
  }

  // load tasks from the backend in the beginning
  useEffect(() => {
    console.log("loading tasks from the backend")
    setTasks([])
  }, [])

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme, defaultRadius: "md" }} withGlobalStyles withNormalizeCSS>
        <div className='App'>
          <Modal
            opened={opened}
            size={"md"}
            title={"New Task"}
            withCloseButton={false}
            onClose={() => {
              setOpened(false)
            }}
            centered
          >
            <form
              onSubmit={(e) => {
                e.preventDefault()
                createTask()
                setOpened(false)
              }}
              style={{ display: "flex", width: "100%", flexDirection: "column" }}
            >
              <TextInput onChange={({ target }) => setTaskTitle(target.value)} mt={"md"} placeholder={"Task Title"} required label={"Title"} />
              <TextInput onChange={({ target }) => setTaskContent(target.value)} mt={"md"} required placeholder={"Task Summary"} label={"Summary"} />
              <Group mt={"md"} position={"apart"}>
                <Button
                  onClick={() => {
                    setOpened(false)
                  }}
                  variant={"subtle"}
                >
                  Cancel
                </Button>
                <Button type='submit'>Create Task</Button>
              </Group>
            </form>
          </Modal>
          <Container size={550} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900
                })}
              >
                My Tasks
              </Title>
              <ActionIcon color={"blue"} onClick={() => toggleColorScheme()} size='lg'>
                {colorScheme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
              </ActionIcon>
            </Group>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                if (task.title) {
                  return (
                    <Card withBorder key={index} mt={"sm"}>
                      <Group position={"apart"}>
                        <Text weight={"bold"}>{task.title}</Text>
                        <ActionIcon
                          onClick={() => {
                            deleteTask(index)
                          }}
                          color={"red"}
                          variant={"transparent"}
                        >
                          <Trash />
                        </ActionIcon>
                      </Group>
                      <Text color={"dimmed"} size={"md"} mt={"sm"}>
                        {task.content ? task.content : "No content was provided for this task"}
                      </Text>
                    </Card>
                  )
                }
              })
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                You have no tasks
              </Text>
            )}
            <Button
              onClick={() => {
                setOpened(true)
              }}
              fullWidth
              mt={"md"}
            >
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
