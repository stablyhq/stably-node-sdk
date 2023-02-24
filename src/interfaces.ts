export type SegmentEventType =
  | 'track'
  | 'page'
  | 'screen'

export type JSONPrimitive = string | number | boolean | null
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
export type JSONObject = { [member: string]: JSONValue }
export type JSONArray = JSONValue[]

export type EventProperties = Record<string, any>

export type Integrations = {
  All?: boolean
  [integration: string]: boolean | JSONObject | undefined
}

export interface CoreOptions {
  integrations?: Integrations
  timestamp?: Timestamp
  context?: CoreExtraContext
  anonymousId?: string
  userId?: string
  // ugh, this is ugly, but we allow literally any property to be passed to options (which get spread onto the event)
  [key: string]: any
}

/**
 * Context is a dictionary of extra information that provides useful context about a datapoint, for example the user’s ip address or locale. You should only use Context fields for their intended meaning.
 * @link https://segment.com/docs/connections/spec/common/#context
 */
export interface CoreExtraContext {
  /**
   * This is usually used to flag an .identify() call to just update the trait, rather than "last seen".
   */
  active?: boolean

  /**
   * Current user's IP address.
   */
  ip?: string

  /**
   * Locale string for the current user, for example en-US.
   * @example en-US
   */
  locale?: string
  /**
   * Dictionary of information about the user’s current location.
   */
  location?: {
    /**
     * @example San Francisco
     */
    city?: string
    /**
     * @example United States
     */
    country?: string
    /**
     * @example 40.2964197
     */
    latitude?: string
    /**
     * @example -76.9411617
     */
    longitude?: string
    /**
     * @example CA
     */
    region?: string
    /**
     * @example 100
     */
    speed?: number
  }

  /**
   * Dictionary of information about the current web page.
   */
  page?: {
    /**
     * @example /academy/
     */
    path?: string
    /**
     * @example https://www.foo.com/
     */
    referrer?: string
    /**
     * @example projectId=123
     */
    search?: string
    /**
     * @example Analytics Academy
     */
    title?: string
    /**
     * @example https://segment.com/academy/
     */
    url?: string
  }

  /**
   * User agent of the device making the request.
   */
  userAgent?: string

  /**
   * Information about the current library.
   *
   * **Automatically filled out by the library.**
   *
   * This type should probably be "never"
   */
  library?: {
    /**
     * @example analytics-node-next/latest
     */
    name: string
    /**
     * @example  "1.43.1"
     */
    version: string
  }

  /**
   * Dictionary of information about the campaign that resulted in the API call, containing name, source, medium, term, content, and any other custom UTM parameter.
   */
  campaign?: {
    name: string
    term: string
    source: string
    medium: string
    content: string
  }

  /**
   * Dictionary of information about the way the user was referred to the website or app.
   */
  referrer?: {
    type?: string
    name?: string
    url?: string
    link?: string

    id?: string // undocumented
    btid?: string // undocumented?
    urid?: string // undocumented?
  }

  amp?: {
    // undocumented?
    id: string
  }

  [key: string]: any
}

type ID = string | null | undefined

export interface CoreSegmentEvent {
  messageId?: string
  type: SegmentEventType

  // page specific
  category?: string
  name?: string

  properties?: EventProperties

  integrations?: Integrations
  context?: CoreExtraContext
  options?: CoreOptions

  userId?: ID
  anonymousId?: ID
  // TODO: consider re-adding these later
  // groupId?: ID
  // previousId?: ID

  event?: string

  writeKey?: string

  sentAt?: Date

  _metadata?: SegmentEventMetadata

  timestamp?: Timestamp
}

export interface SegmentEventMetadata {
  failedInitializations?: unknown[]
  bundled?: string[]
  unbundled?: string[]
  nodeVersion?: string
  bundledConfigIds?: string[]
  unbundledConfigIds?: string[]
  bundledIds?: string[]
}

export type Timestamp = Date | string

/**
 * A Plan allows users to specify events and which destinations they would like them to be sent to
 */
export interface Plan {
  track?: TrackPlan
  identify?: TrackPlan
  group?: TrackPlan
}

export interface TrackPlan {
  [key: string]: PlanEvent | undefined
  // __default SHOULD always exist, but marking as optional for extra safety.
  __default?: PlanEvent
}

export interface PlanEvent {
  /**
   * Whether or not this plan event is enabled
   */
  enabled: boolean
  /**
   * Which integrations the plan event applies to
   */
  integrations?: {
    [key: string]: boolean
  }
}