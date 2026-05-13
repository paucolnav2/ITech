#!/bin/sh

HOST=java
PORT=8080

# ── Threshold limits (mirrors config.properties limit.amount.*) ──────────────
LIMIT_TEMPERATURE=100
LIMIT_HUMIDITY=98
LIMIT_VIBRATION=3000
LIMIT_PRESSURE=5
LIMIT_LIGHT=28000
LIMIT_SOUND=180
LIMIT_MOISTURE=70

# ── Sensible physical minimums per sensor type ────────────────────────────────
MIN_TEMPERATURE=15
MIN_HUMIDITY=20
MIN_VIBRATION=10
MIN_PRESSURE=1
MIN_LIGHT=50
MIN_SOUND=30
MIN_MOISTURE=5

# ── Upper caps = 125% of each limit ──────────────────────────────────────────
CAP_TEMPERATURE=125
CAP_HUMIDITY=122
CAP_VIBRATION=3750
CAP_PRESSURE=6
CAP_LIGHT=35000
CAP_SOUND=225
CAP_MOISTURE=87

# Seconds between forced critical anomaly bursts
BURST_INTERVAL=20

# ── Helpers ───────────────────────────────────────────────────────────────────

type_by_index() {
    case $1 in
        0) echo TEMPERATURE ;; 1) echo HUMIDITY   ;; 2) echo VIBRATION ;;
        3) echo PRESSURE    ;; 4) echo LIGHT      ;; 5) echo SOUND     ;;
        6) echo MOISTURE    ;;
    esac
}

type_min()   { eval echo \$MIN_$1;   }
type_cap()   { eval echo \$CAP_$1;   }
type_limit() { eval echo \$LIMIT_$1; }

# Random float in [lo, hi], seeded from $RANDOM each call
rand_float() {
    awk "BEGIN { srand($RANDOM); printf \"%.2f\", $1 + rand() * ($2 - $1) }"
}

rand_sensor() {
    awk "BEGIN { srand($RANDOM); print int(rand() * 1750) + 1 }"
}

rand_type() {
    type_by_index "$(awk "BEGIN { srand($RANDOM); print int(rand() * 7) }")"
}

send() {
    MSG="${1};${2};${3}"
    echo "$MSG" | nc -w 2 $HOST $PORT
    printf "[%s] Sent: %s\n" "$(date '+%H:%M:%S')" "$MSG"
}

# ── Main loop ─────────────────────────────────────────────────────────────────

LAST_BURST=$(date +%s)

while true; do
    NOW=$(date +%s)

    # ── Forced critical anomaly burst every BURST_INTERVAL seconds ──────────
    if [ $((NOW - LAST_BURST)) -ge $BURST_INTERVAL ]; then
        B_SENSOR=$(rand_sensor)
        B_TYPE=$(rand_type)
        B_LIMIT=$(type_limit "$B_TYPE")
        B_CAP=$(type_cap "$B_TYPE")
        # Burst values are between 105% and 125% of the limit (clearly anomalous)
        B_MIN=$(awk "BEGIN { printf \"%.2f\", $B_LIMIT * 1.05 }")

        printf "\n>>> CRITICAL BURST: sensor %s  type %s  limit %s <<<\n" \
               "$B_SENSOR" "$B_TYPE" "$B_LIMIT"

        for i in 1 2 3; do
            VAL=$(rand_float "$B_MIN" "$B_CAP")
            send "$B_SENSOR" "$B_TYPE" "$VAL"
            [ "$i" -lt 3 ] && sleep 1
        done
        printf "\n"

        LAST_BURST=$(date +%s)
    fi

    # ── Normal random data point ─────────────────────────────────────────────
    SENSOR=$(rand_sensor)
    TYPE=$(rand_type)
    VALUE=$(rand_float "$(type_min "$TYPE")" "$(type_cap "$TYPE")")
    send "$SENSOR" "$TYPE" "$VALUE"

    # ── Random interval 0.75 – 3 seconds ────────────────────────────────────
    INTERVAL=$(awk "BEGIN { srand($RANDOM); printf \"%.2f\", 0.75 + rand() * 2.25 }")
    sleep "$INTERVAL"
done
