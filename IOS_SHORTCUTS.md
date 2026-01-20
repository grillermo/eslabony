# iOS Shortcut Setup Integration

This guide explains how to create an iOS Shortcut to save links to your Link Saver app.

## Prerequisites
- **Link Saver URL**: The public URL of your app (e.g., `https://links.yourdomain.com/api/links`).
- **Authorization Token**: `44p9Wq6iJRxp4DE2vp4b3Yw6KWhRjcNohjDetwwRNy4K7cyUcxdwuWTUxVZUJkhWVjU`

## Step-by-Step Instructions

1.  **Open Shortcuts App**:
    Open the **Shortcuts** app on your iPhone or iPad.

2.  **Create a New Shortcut**:
    Tap the **+** (plus) icon in the top right to create a new shortcut.

3.  **Rename**:
    Tap the value "New Shortcut" at the top -> **Rename**. Call it "Save Link".
    Tap the icon to change the color/glyph if desired.

4.  **Accept Input**:
    - Search for the action **Receive What's On Screen** (or tap the "i" info entry and enable "Show in Share Sheet").
    - In the action, tap "Images and 18 more" and deselect everything except **URLs**.
    - It should read: `Receive URLs input from Share Sheet`.

5.  **Get URL Variable**:
    - Add action **Set Variable** (optional, but clean). Name it `LinkURL`, value is `Shortcut Input`.
    - Alternatively, just use `Shortcut Input` directly.

6.  **Inputs (Optional Note)**:
    - Add action **Ask for Input**.
    - Prompt: "Add a note (optional)?".
    - Type: Text.
    - Set Variable: `LinkNote`.

7.  **Get Contents of URL (Make Request)**:
    - Add action **Get Contents of URL**.
    - **URL**: Paste your endpoint: `https://<YOUR_DOMAIN>/api/links` (or `http://<LOCAL_IP>:3000/api/links` if testing locally on same wifi).
    - **Method**: Tap `GET` and change to `POST`.
    - **Headers**:
        - Tap headers (+).
        - Key: `Authorization`
        - Value: `44p9Wq6iJRxp4DE2vp4b3Yw6KWhRjcNohjDetwwRNy4K7cyUcxdwuWTUxVZUJkhWVjU`
        - Key: `Content-Type`
        - Value: `application/json`
    - **Request Body**:
        - Change form "JSON".
        - Add new field (+):
            - Key: `link`
            - Value: Select "Shortcut Input" (or variable `LinkURL`).
        - Add new field (+):
            - Key: `note`
            - Value: Select "Provided Input" (from the "Ask for Input" step).

8.  **Feedback Notification**:
    - Add action **Show Notification**.
    - Text: "Link Saved Successfully".

9.  **Finish**:
    Tap **Done**.

## Usage
1.  Open Safari or Chrome on your phone.
2.  Navigate to a website.
3.  Tap the **Share** button.
4.  Scroll down and tap **Save Link**.
5.  Enter a note if prompted.
6.  The link is sent to your server.
