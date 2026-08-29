# Editing the website from your browser

No Cursor. No terminal. No installing anything. This works from a laptop, an iPad, or a phone.

Everything on the site — every headline, price, description — lives in one file. You edit it on GitHub's website, click save, and the site updates itself about a minute later.

---

## One-time setup

You need a GitHub account with access to the site.

1. Make a free account at [github.com](https://github.com)
2. Cody adds you to the `jtcc-site` repository (his side: **Settings → Collaborators → Add people**)
3. Accept the email invite

Done. That's the only setup.

---

## Making a change

### 1. Open the file

Go to **[github.com/hellocodyux/jtcc-site](https://github.com/hellocodyux/jtcc-site)**

Click through: **`src`** → **`content`** → **`content.json`**

You'll see the site's text laid out in a long list. Recognizable — headlines, descriptions, prices.

### 2. Click the pencil

Top right of the file, there's a **pencil icon** (✏️). Click it. The text becomes editable.

### 3. Change the words

Find what you want to change and type over it.

The file is a list of labels and values, like this:

```json
"headline": "Good food. Better company.",
```

The part on the left (`"headline"`) is the label — **don't touch it**. The part on the right is what shows on the site. Change that.

Use **⌘F** to search. If you want to change a headline you saw on the site, search for a few words of it.

**The four rules:**

1. Only change text **inside** the quotation marks
2. Leave every comma, bracket, and brace exactly where it is
3. Don't rename the labels on the left
4. Apostrophes are fine. A stray `"` inside your text will break it — use `'` instead

### 4. Save

Scroll to the bottom. There's a box that says **Commit changes**.

- In the message box, write what you changed — "Updated wedding pricing," that sort of thing
- Leave "Commit directly to the main branch" selected
- Click the green **Commit changes** button

### 5. Wait a minute

The site rebuilds by itself. Refresh after about a minute and your change is there.

To watch it happen: [vercel.com](https://vercel.com) → jtcc-site → **Deployments**. The newest one says Building, then Ready.

---

## If you break something

**You can't take the site down.** If an edit has a mistake in it, the rebuild fails and the site simply keeps showing the last working version. Nothing goes dark. Worst case, a change doesn't appear.

**To check:** vercel.com → jtcc-site → Deployments. If the newest says **Error** instead of Ready, the edit had a problem.

**To fix:** go back to `content.json` on GitHub, click **History** (top right), find the version before your change, and copy the correct text back in.

Or just say what you were trying to change and it can be fixed for you.

**The usual culprit** is a missing comma or an extra quotation mark. GitHub highlights JSON, so a broken line often looks visibly wrong — colors go strange partway through.

---

## What you can change from the browser

| Change | Where in the file |
|---|---|
| Hero headline and subtitle | `hero` |
| The "Everybody eats" paragraphs | `intro` |
| Service names and descriptions | `services` |
| Photo captions | `media` → `gallery` |
| Testimonial quotes and names | `testimonials` |
| Contact heading and email | `contact` |
| Footer tagline | `footer` |
| Page title for Google | `seo` |
| Instagram feed ID | `instagram` → `feedId` |

**What needs a developer:** layout, colors, fonts, adding or removing whole sections, new photos.

---

## Photos

Photos aren't in this file — they're image files, and swapping them is a different job. Send new ones to Cody and they'll get added.

The captions under photos *are* editable here, under `media` → `gallery` → `caption`.

---

## A safer way, once you're comfortable

Instead of committing straight to the live site, GitHub can save your edit as a **proposal** that Cody reviews first.

At step 4, choose **"Create a new branch for this commit and start a pull request"** instead of committing directly. Vercel builds a private preview of your version and posts the link. Cody looks, approves, and it goes live.

Worth using for bigger rewrites. Overkill for fixing a typo.

---

## The short version

1. github.com/hellocodyux/jtcc-site → `src` → `content` → `content.json`
2. Pencil icon
3. Change words inside the quotes
4. Green **Commit changes** button
5. Wait a minute

That's the whole thing.
