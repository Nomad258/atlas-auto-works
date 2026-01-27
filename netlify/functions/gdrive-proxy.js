// Netlify function to proxy Google Drive files for CORS support
// Works with publicly shared Google Drive files (no API key required)
// Just share your files with "Anyone with the link can view"

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    }
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Get the file ID from query parameters
  const fileId = event.queryStringParameters?.fileId

  if (!fileId) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Missing fileId parameter' })
    }
  }

  // Validate file ID format (basic validation)
  if (!/^[a-zA-Z0-9_-]+$/.test(fileId)) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Invalid fileId format' })
    }
  }

  try {
    // Google Drive direct download URL for publicly shared files
    // This URL pattern works for files shared with "Anyone with the link"
    const directUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`

    console.log(`Fetching Google Drive file: ${fileId}`)

    const response = await fetch(directUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://drive.google.com/'
      },
      redirect: 'follow'
    })

    // Check response status
    if (!response.ok) {
      console.error(`Google Drive returned status: ${response.status}`)
      return {
        statusCode: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          error: `Google Drive returned status ${response.status}`,
          hint: 'Make sure the file is shared with "Anyone with the link can view"'
        })
      }
    }

    // Check content type
    const contentType = response.headers.get('content-type') || ''
    console.log(`Content-Type: ${contentType}`)

    // If Google returns HTML, it's probably an error or virus scan page
    if (contentType.includes('text/html')) {
      const htmlContent = await response.text()

      // Check for virus scan warning (files > 100MB)
      if (htmlContent.includes('virus scan') || htmlContent.includes('confirm=')) {
        // Extract the confirm token and retry
        const confirmMatch = htmlContent.match(/confirm=([a-zA-Z0-9_-]+)/) ||
                           htmlContent.match(/download-form.*confirm.*?value="([^"]+)"/)

        if (confirmMatch) {
          const confirmToken = confirmMatch[1]
          const confirmedUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=${confirmToken}`

          const confirmedResponse = await fetch(confirmedUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
              'Accept': '*/*'
            },
            redirect: 'follow'
          })

          if (confirmedResponse.ok) {
            const buffer = await confirmedResponse.arrayBuffer()
            return sendFileResponse(buffer)
          }
        }
      }

      return {
        statusCode: 403,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          error: 'File not accessible',
          hint: 'Make sure the file is shared with "Anyone with the link can view". For very large files, try splitting them.'
        })
      }
    }

    // Get the file data
    const buffer = await response.arrayBuffer()
    console.log(`Downloaded ${buffer.byteLength} bytes`)

    return sendFileResponse(buffer)

  } catch (error) {
    console.error('Error proxying Google Drive file:', error)
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    }
  }
}

function sendFileResponse(buffer) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'model/gltf-binary',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      'Content-Length': buffer.byteLength.toString()
    },
    body: Buffer.from(buffer).toString('base64'),
    isBase64Encoded: true
  }
}
