from engine import predict

import tkinter as tk
from tkinter import scrolledtext

super_tags = ['implementation', 'maths', 'graphs', 'optimization', 'special-strings']

def main():
    def on_button_click():
        user_input = text_box.get("1.0", tk.END).strip()
        prediction = predict(user_input)
        my_preds = []
        for pred, tag in zip(prediction[0], super_tags):
            my_preds.append((pred, tag))
        for pred, tag in sorted(my_preds, key=lambda x: x[0], reverse=True):
            print(f"{tag}: {pred}")
        print()
        
    # Create the main window
    root = tk.Tk()
    root.title("Programming Problems Classifier")

    # Create a label
    label = tk.Label(root, text="Enter the problem:")
    label.pack()

    # Create a text box
    text_box = scrolledtext.ScrolledText(root, width=50, height=20, wrap=tk.WORD)
    text_box.pack()

    # Create a button
    button = tk.Button(root, text="Submit", command=on_button_click)
    button.pack()

    # Run the application
    root.mainloop()


if __name__ == "__main__":
    main()