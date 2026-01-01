"use client";

// Test route to trigger the error page
export default function TestErrorPage() {
	throw new Error("This is a test error to demonstrate the error page. You can safely ignore this.");
}

