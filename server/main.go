package main

import (
	"fmt"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Todo struct {
	ID int `json:"id"`
	Title string `json:"title"`
	Done bool `json:"done"`
	Body string `json:"body"`
}

func main() {
	app := fiber.New()
	todos := []Todo{}

	app.Get("/healthcheck", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,DELETE,PUT",
	}))

	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if err := c.BodyParser(todo); err != nil {
			return err
		}
		
		todo.ID = len(todos)+1
		todos = append(todos, *todo)

		return c.JSON((todos))
	})

	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON((todos))
	})

	// Update a todo
	app.Put("/api/todos/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		todoID, err := strconv.Atoi(id)
		if err != nil {
			return fiber.ErrBadRequest
		}

		fmt.Println(todoID)

		todo := &Todo{}
		if err := c.BodyParser(todo); err != nil {
			return err
		}

		// Find the todo by ID and update it
		found := false
		for i, t := range todos {
			if t.ID == todoID {
				todos[i].Title = todo.Title
				todos[i].Done = todo.Done
				todos[i].Body = todo.Body
				found = true
				break
			}
		}

		if !found {
			return fiber.ErrNotFound
		}

		return c.JSON(todo)
	})

		// Delete a todo
		app.Delete("/api/todos/:id", func(c *fiber.Ctx) error {
			id := c.Params("id")
			todoID, err := strconv.Atoi(id)
			if err != nil {
				return fiber.ErrBadRequest
			}
	
			// Find the todo by ID and delete it
			found := false
			for i, t := range todos {
				if t.ID == todoID {
					todos = append(todos[:i], todos[i+1:]...)
					found = true
					break
				}
			}
	
			if !found {
				return fiber.ErrNotFound
			}
	
			return c.SendStatus(fiber.StatusNoContent)
		})

	log.Fatal((app.Listen(":4000")))
}
