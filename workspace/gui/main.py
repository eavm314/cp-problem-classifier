import tkinter as tk
from engine import predict


def main():
    def on_button_click():
        user_input = text_box.get()
        prediction = predict(user_input)
        print(f"Prediction: {prediction}")
    # Create the main window
    root = tk.Tk()
    root.title("Simple Window")

    # Create a label
    label = tk.Label(root, text="Enter something:")
    label.pack()

    # Create a text box
    text_box = tk.Entry(root, width=40)
    text_box.pack()

    # Create a button
    button = tk.Button(root, text="Submit", command=on_button_click)
    button.pack()

    # Run the application
    root.mainloop()


if __name__ == "__main__":
    main()